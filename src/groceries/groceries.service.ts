import {
    Injectable,
    HttpException,
    HttpStatus,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, UpdateResult, DeleteResult } from 'typeorm';
  import { Grocery } from './entities/grocery.entity';
  import { CreateGroceryDto } from './dto/create-grocery.dto';
  import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { UpdateInventoryDto } from './dto/update-grocery-inventry.dto';
  
  @Injectable()
  export class GroceriesService {
    private readonly logger = new Logger(GroceriesService.name);
  
    constructor(
      @InjectRepository(Grocery)
      private groceriesRepository: Repository<Grocery>,
    ) {}
  
    async create(dto: CreateGroceryDto): Promise<Grocery> {
      try {
        const grocery = this.groceriesRepository.create(dto);
        return await this.groceriesRepository.save(grocery);
      } catch (error) {
        this.logger.error('Error creating grocery', error.stack);
        throw new HttpException(
          'Failed to create grocery item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async findAll(): Promise<Grocery[]> {
      try {
        const grocery = await this.groceriesRepository.find();
        return grocery.filter(item => item.stock > 0);
      } catch (error) {
        this.logger.error('Error fetching groceries', error.stack);
        throw new HttpException(
          'Failed to fetch groceries',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async findOne(id: number): Promise<Grocery | null> {
      try {
        const grocery = await this.groceriesRepository.findOneBy({ id });
        return grocery ?? null;
      } catch (error) {
        this.logger.error(`Error finding grocery with id ${id}`, error.stack);
        throw new HttpException(
          'Failed to find grocery item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async update(id: number, dto: UpdateGroceryDto): Promise<Grocery | null> {
      try {
        const result: UpdateResult = await this.groceriesRepository.update(id, dto);
        if (result.affected === 0) {
          throw new NotFoundException(`Grocery item with id ${id} not found`);
        }
        return await this.findOne(id);
      } catch (error) {
        this.logger.error(`Error updating grocery with id ${id}`, error.stack);
        if (error instanceof HttpException) throw error;
        throw new HttpException(
          'Failed to update grocery item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async updateInventory(id: number, stock: UpdateInventoryDto): Promise<Grocery | null> {
      try {
        const result = await this.groceriesRepository.update(id, stock);
        if (result.affected === 0) {
          throw new NotFoundException(`Grocery item with id ${id} not found`);
        }
        return await this.findOne(id);
      } catch (error) {
        this.logger.error(`Error updating inventory for grocery ${id}`, error.stack);
        if (error instanceof HttpException) throw error;
        throw new HttpException(
          'Failed to update grocery inventory',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    async remove(id: number): Promise<DeleteResult> {
      try {
        const result = await this.groceriesRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Grocery item with id ${id} not found`);
        }
        return result;
      } catch (error) {
        this.logger.error(`Error deleting grocery with id ${id}`, error.stack);
        if (error instanceof HttpException) throw error;
        throw new HttpException(
          'Failed to delete grocery item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  