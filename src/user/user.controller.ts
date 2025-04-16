import { Controller, Get, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ResponseDto } from './dto/reponse.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)  
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "GET all user"})
  @ApiOkResponse({
    description: "successfully find all user",
    type: User,
    isArray: true
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async findAll(): Promise<ResponseDto<Partial<User>[]>> {
    const users = await this.userService.findAll();
    return new ResponseDto(
      HttpStatus.OK,
      'Users fetched successfully',
      users,
    );
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary : "Find user by ID"})
  @ApiOkResponse({
    description: "successfully find user by ID",
    type: User
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Partial<User>>> {
    const user = await this.userService.findOne(id);
    return new ResponseDto(
      HttpStatus.OK,
      'User fetched successfully',
      user,
    );
  }
  
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "Remove user"})
  @ApiOkResponse({
    description: "successfully deleted user by ID",
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.userService.remove(id);
    return new ResponseDto(
      HttpStatus.OK,
      `User with ID ${id} deleted successfully`,
      null,
    );
  }
}
