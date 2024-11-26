import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
constructor(private readonly userService: UserService) {}

@Post("add")
@HttpCode(HttpStatus.CREATED)
async createUser(@Body() body: any) {
  try {
    const user = await this.userService.createUser(body)
    return {
        message: 'User created successfully',
        statusCode: HttpStatus.CREATED
    }
  } catch (error) {
    if (error instanceof HttpException) { 
      throw error;
    }
  }
}

@Get("users")
@HttpCode(HttpStatus.OK)
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(Role.Admin, Role.User) 
async fechAlluser() {
  try {
    const users = await this.userService.fetchAllUsers()
    return {
        message: 'All users fetched successfully',
        statusCode: HttpStatus.OK,
        users
    }
  } catch (error) {
    console.log(error)
  }
}

@Get("admin") 
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.Admin)
async getUser() {
    try {
      return "admin page"
    } catch (error) {
      
    }
}
}
