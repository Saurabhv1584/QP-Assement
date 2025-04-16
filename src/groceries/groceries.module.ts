import { Module } from '@nestjs/common';
import { GroceriesController } from './groceries.controller';
import { GroceriesService } from './groceries.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grocery } from './entities/grocery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grocery]), JwtModule],
  controllers: [GroceriesController],
  providers: [GroceriesService],
  exports: [GroceriesService],
})
export class GroceriesModule {}
