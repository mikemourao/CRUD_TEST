import {
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config
      .get<string>('DEFAULT_USER_EMAIL', 'milena.santana@energy.org.br')
      .toLowerCase();
    const registration = this.config.get<string>(
      'DEFAULT_USER_REGISTRATION',
      '000001',
    );
    const password = this.config.get<string>('DEFAULT_USER_PASSWORD', 'abc123');
    const name = 'Milena Santana Borges';
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { registration }],
    });

    if (existingUser) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.registration = registration;
      existingUser.password = await hash(password, 12);
      await this.usersRepository.save(existingUser);
      return;
    }

    await this.usersRepository.save(
      this.usersRepository.create({
        name,
        email,
        registration,
        password: await hash(password, 12),
      }),
    );
  }

  async login(dto: LoginDto): Promise<UserResponseDto> {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(
        'LOWER(user.email) = :identifier OR user.registration = :identifier',
        { identifier },
      )
      .getOne();

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('E-mail, matrícula ou senha inválidos');
    }

    const { id, name, email, registration, createdAt, updatedAt } = user;
    return { id, name, email, registration, createdAt, updatedAt };
  }
}
