import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, In } from 'typeorm';
  import { Order } from './entities/orders.entity';
  import { Grocery } from 'src/groceries/entities/grocery.entity';
  import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
  
  @Injectable()
  export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);
  
    constructor(
      @InjectRepository(Order)
      private orderRepo: Repository<Order>,
      @InjectRepository(Grocery)
      private groceryRepo: Repository<Grocery>,
    ) {}
  
    async create(dto: CreateOrderDto, 
      userId: string): Promise<Order> {
      try {
        const groceries = await this.groceryRepo.findBy({
          id: In(dto.items.map(i => i.groceryId)),
        });
  
        if (groceries.length !== dto.items.length) {
          throw new NotFoundException('Some groceries were not found');
        }
  
        const orderItems = groceries.map((grocery) => {
          const quantity = dto.items.find(i => i.groceryId === grocery.id)?.quantity || 1;
          return {
            grocery,
            quantity,
          } as OrderItem;  
        });
  
        const order = this.orderRepo.create({
          userId,
          items: orderItems,
        });
  
        const response = await this.orderRepo.save(order);
        return response;
      } catch (error) {
        this.logger.error('Error creating order', error.stack);
        throw new HttpException(
          'Failed to create order',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async findAllGrocery(): Promise<Grocery[]> {
      try {
        const response = await this.groceryRepo.find();
        return response; 
      } catch (error) {
        this.logger.error('Error fetching groceries', error.stack);
        throw new HttpException(
          'Failed to fetch groceries',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    async findOne(id: number): Promise<Order | null> {
      try {
        const order = await this.orderRepo.findOne({
          where: { id },
          relations: ['items', 'items.grocery'],
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${id} not found`);
        }
  
        return order;
      } catch (error) {
        this.logger.error(`Error finding order with ID ${id}`, error.stack);
        throw new HttpException(
          'Failed to fetch order',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async findAll(): Promise<Order[]> {
      try {
        const response = await this.orderRepo.find({
          relations: ['items', 'items.grocery'],
        });
        return response
      } catch (error) {
        this.logger.error('Error fetching all orders', error.stack);
        throw new HttpException(
          'Failed to fetch orders',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  