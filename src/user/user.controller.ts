import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  PaginationDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import {
  UserCreateDto,
  UserLoginDto,
  UserLoginSocialDto,
} from './dto/user.dto';
import { PublicUserData } from './interface/user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginationDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @ApiPaginatedResponse('entities', PublicUserData)
  @Get('list')
  async getUserList(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }

  @UseGuards(AuthGuard())
  @Post('account/create')
  async createUserAccount(@Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }

  @Post('account/:userId/animal')
  async addAnimalToUser() {
    return 'New user';
  }

  @Post('login')
  async login(@Body() body: UserLoginDto) {
    return this.userService.login(body);
  }

  @Post('social/login')
  async socialLogin(@Body() body: UserLoginSocialDto) {
    return this.userService.loginSocial(body);
  }

  @Delete()
  async deleteUserAccount() {
    return 'delete';
  }

  @Patch(':userId')
  async updateUserProfile() {
    return 'update';
  }

  @Get('/:userId')
  async getUserProfile(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }
}
