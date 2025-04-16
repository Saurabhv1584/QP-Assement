import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'stock',
    required: true,
    example: 100,
  })
  stock: number;
}
