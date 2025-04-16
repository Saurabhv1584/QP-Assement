import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GroceriesService } from './groceries.service';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { Grocery } from './entities/grocery.entity';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { ResponseDto } from 'src/auth/dto/response.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateInventoryDto } from './dto/update-grocery-inventry.dto';

@ApiTags('Admin Groceries')
@Controller('admin/groceries')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a new grocery item' })
  @ApiOkResponse({ description: 'Item added successfully', type: Grocery })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async create(
    @Body() dto: CreateGroceryDto,
  ): Promise<ResponseDto<Partial<Grocery>>> {
    const grocery = await this.groceriesService.create(dto);
    return new ResponseDto(HttpStatus.CREATED, 'Item created', grocery);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all grocery items' })
  @ApiOkResponse({
    description: 'All items retrieved',
    type: Grocery,
    isArray: true,
  })
  async findAll(): Promise<ResponseDto<Partial<Grocery>[]>> {
    const groceries = await this.groceriesService.findAll();
    return new ResponseDto(HttpStatus.OK, 'Items fetched', groceries);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a grocery item by ID' })
  @ApiOkResponse({ description: 'Item found', type: Grocery })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDto<Partial<Grocery>>> {
    const grocery = await this.groceriesService.findOne(+id);
    if (!grocery) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Item not found', {});
    }
    return new ResponseDto(HttpStatus.OK, 'Item found', grocery);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a grocery item' })
  @ApiOkResponse({ description: 'Item updated successfully', type: Grocery })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGroceryDto,
  ): Promise<ResponseDto<Partial<Grocery>>> {
    const updated = await this.groceriesService.update(+id, dto);
    if (!updated) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Item not found', {});
    }
    return new ResponseDto(HttpStatus.OK, 'Item updated', updated);
  }

  @Patch(':id/inventory')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update grocery inventory stock' })
  @ApiOkResponse({ description: 'Inventory updated', type: Grocery })
  async updateInventory(
    @Param('id') id: string,
    @Body('stock') stock: UpdateInventoryDto,
  ): Promise<ResponseDto<Partial<Grocery>>> {
    const updated = await this.groceriesService.updateInventory(+id, stock);
    if (!updated) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Item not found', {});
    }
    return new ResponseDto(HttpStatus.OK, 'Inventory updated', updated ?? {});
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a grocery item' })
  @ApiOkResponse({ description: 'Item deleted successfully' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async remove(@Param('id') id: string): Promise<ResponseDto<{}>> {
    const result = await this.groceriesService.remove(+id);
    if (!result) {
      return new ResponseDto(HttpStatus.NOT_FOUND, 'Item not found', {});
    }
    return new ResponseDto(HttpStatus.OK, 'Item deleted', {});
  }
}
