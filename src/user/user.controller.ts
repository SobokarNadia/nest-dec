import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/userList')
  async getUserList() {
    return this.userService.getAllUsers();
  }

  @Post('account/create')
  async createUserAccount(@Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }

  @Post('account/:userId/animal')
  async addAnimalToUser() {
    return 'New user';
  }

  @Delete()
  async deleteUserAccount() {
    return 'delete';
  }

  @Patch('/:userId')
  async updateUserProfile() {
    return 'update';
  }

  @Get('/:userId')
  async getUserProfile(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }
}
