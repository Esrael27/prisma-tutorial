import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; // Import Role enum

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(body: { name: string; email: string; password: string; role: string }) {
    try {
      // Check if email already exists
      const checkExists = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (checkExists) {
        throw new ConflictException({
          message: 'Email already exists',
          statusCode: HttpStatus.CONFLICT,
        });
      }

      const saltOrRounds = 10;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, saltOrRounds);

      // Ensure the role is valid (use the Role enum)
      if (!Object.values(Role).includes(body.role as Role)) {
        throw new BadRequestException({
          message: 'Invalid role provided',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const user = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          role: body.role as Role, // Cast to Role enum
        },
      });

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle other errors
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }

  // Fetch all users with selected fields
  async fetchAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      return users;
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Failed to fetch users',
      });
    }
  }
}
