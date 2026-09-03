import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type MockRepository = Partial<Record<keyof Repository<User>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository;

  const user: User = {
    id: '9ba363c9-1d7c-4924-9406-901f1d23c516',
    name: 'Millena Silva',
    email: 'millena@wenlock.com',
    registration: '123456',
    password: 'hashed-password',
    createdAt: new Date('2024-11-22T00:00:00Z'),
    updatedAt: new Date('2024-11-22T00:00:00Z'),
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn((value: Partial<User>) => value),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn((target: User, changes: Partial<User>) =>
        Object.assign(target, changes),
      ),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('returns paginated users without passwords', async () => {
    repository.findAndCount?.mockResolvedValue([[user], 1]);

    const result = await service.findAll({ page: 1, limit: 15 });

    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0]).not.toHaveProperty('password');
  });

  it('returns a user by id without its password', async () => {
    repository.findOneBy?.mockResolvedValue(user);

    const result = await service.findOne(user.id);

    expect(result).toMatchObject({ id: user.id, email: user.email });
    expect(result).not.toHaveProperty('password');
  });

  it('throws when a user does not exist', async () => {
    repository.findOneBy?.mockResolvedValue(null);

    await expect(service.findOne(user.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deletes an existing user', async () => {
    repository.delete?.mockResolvedValue({ affected: 1 });

    await expect(service.remove(user.id)).resolves.toBeUndefined();
  });
});
