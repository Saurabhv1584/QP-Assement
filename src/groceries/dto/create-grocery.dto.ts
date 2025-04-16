import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateGroceryDto {
  @ApiProperty({
    description: 'name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'price',
    required: true,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'stock',
    required: true,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
