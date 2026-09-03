import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    description:
      'Busca parcial, sem diferenciar maiúsculas e minúsculas, pelo nome',
    example: 'Millena',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  search?: string;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    default: 15,
    minimum: 1,
    maximum: 100,
    example: 15,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 15;
}
