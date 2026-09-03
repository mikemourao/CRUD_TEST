import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'milena.santana@energy.org.br',
    description: 'E-mail ou matrícula do usuário',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'abc123', minLength: 6, writeOnly: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
