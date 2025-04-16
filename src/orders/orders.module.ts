import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { Grocery } from 'src/groceries/entities/grocery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Grocery]),
    JwtModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
