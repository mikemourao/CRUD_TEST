import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Millena Silva',
    description: 'Nome completo contendo somente letras e espaços',
    maxLength: 120,
    pattern: '^[\\p{L}\\s]+$',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'name must contain only letters and spaces',
  })
  name: string;

  @ApiProperty({
    example: 'millena@wenlock.com',
    description: 'E-mail único e válido',
    format: 'email',
    maxLength: 160,
  })
  @IsEmail()
  @MaxLength(160)
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Matrícula contendo apenas números',
    pattern: '^\\d+$',
    maxLength: 30,
  })
  @IsString()
  @Matches(/^\d+$/, { message: 'registration must contain only numbers' })
  @MaxLength(30)
  registration: string;

  @ApiProperty({
    example: 'abc123',
    description: 'Senha com exatamente seis caracteres alfanuméricos',
    minLength: 6,
    maxLength: 6,
    pattern: '^[a-zA-Z0-9]{6}$',
    writeOnly: true,
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9]{6}$/, {
    message: 'password must contain exactly 6 alphanumeric characters',
  })
  password: string;
}
