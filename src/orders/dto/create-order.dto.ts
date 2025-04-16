import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'groceryId',
    required: true,
    example: 1,
  })
  @IsInt()
  groceryId: number;

  @ApiProperty({
    description: 'quantity',
    required: true,
    example: 100,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'items',
    required: true,
    example: [
      {
        groceryId: 2**2,
        quantity: 10,
      },
    ],
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
