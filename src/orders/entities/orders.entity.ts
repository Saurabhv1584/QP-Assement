import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    Column,
  } from 'typeorm';
  import { Grocery } from 'src/groceries/entities/grocery.entity';
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToMany(() => Grocery)
    @JoinTable()
    items: Grocery[];
  }
  