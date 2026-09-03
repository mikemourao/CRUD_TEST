import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '9ba363c9-1d7c-4924-9406-901f1d23c516',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ example: 'Millena Silva' })
  name: string;

  @ApiProperty({ example: 'millena@wenlock.com', format: 'email' })
  email: string;

  @ApiProperty({ example: '123456' })
  registration: string;

  @ApiProperty({ example: '2024-11-22T12:00:00.000Z', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ example: '2024-11-22T12:00:00.000Z', format: 'date-time' })
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 15 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
