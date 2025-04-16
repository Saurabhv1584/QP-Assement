import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/orders.entity';
import { ResponseDto } from 'src/auth/dto/response.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Grocery } from 'src/groceries/entities/grocery.entity';


@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiOkResponse({ description: 'Order created successfully', type: Order })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async create(@Body() dto: CreateOrderDto, @Req() req: any,): Promise<ResponseDto<Order>> {
    const userId = req?.user?.id || '';
    const order = await this.ordersService.create(dto, userId);
    return new ResponseDto(HttpStatus.CREATED, 'Order created successfully', order);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get list of available grocery items' })
  @ApiOkResponse({ description: 'Available grocery items retrieved', type: Order })
  @ApiNotFoundResponse({ description: 'Grocery items not found' })
  async listGroceryItem(): Promise<ResponseDto<Partial<Grocery>[]>> {
    const order = await this.ordersService.findAllGrocery();
    if (!order) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Grocery items not found', []);
    }
    return new ResponseDto(HttpStatus.OK, 'Grocery items fetched successfully', order);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiOkResponse({ description: 'Order retrieved', type: Order })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Partial<Order>>> {
    const order = await this.ordersService.findOne(+id);
    if (!order) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Order not found', {});
    }
    return new ResponseDto(HttpStatus.OK, 'Order fetched successfully', order);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiOkResponse({
    description: 'All orders retrieved',
    type: Order,
    isArray: true,
  })
  async findAll(): Promise<ResponseDto<Partial<Order>[]>> {
    const orders = await this.ordersService.findAll();
    return new ResponseDto(HttpStatus.OK, 'Orders fetched successfully', orders);
  }
}
