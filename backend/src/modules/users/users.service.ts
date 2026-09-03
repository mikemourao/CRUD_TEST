import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.usersRepository.create({
      ...dto,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      password: await hash(dto.password, 12),
    });

    try {
      return this.toResponse(await this.usersRepository.save(user));
    } catch (error: unknown) {
      this.handleDatabaseError(error);
      throw error;
    }
  }

  async findAll(query: ListUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    const { page, limit, search } = query;
    const [users, total] = await this.usersRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map((user) => this.toResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return this.toResponse(await this.findEntity(id));
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findEntity(id);
    const changes: Partial<User> = {
      ...dto,
      name: dto.name?.trim(),
      email: dto.email?.trim().toLowerCase(),
    };

    if (dto.password) changes.password = await hash(dto.password, 12);
    this.usersRepository.merge(user, changes);

    try {
      return this.toResponse(await this.usersRepository.save(user));
    } catch (error: unknown) {
      this.handleDatabaseError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  private async findEntity(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private toResponse(user: User): UserResponseDto {
    const { id, name, email, registration, createdAt, updatedAt } = user;
    return { id, name, email, registration, createdAt, updatedAt };
  }

  private handleDatabaseError(error: unknown): void {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      throw new ConflictException('Email or registration already registered');
    }
  }
}
