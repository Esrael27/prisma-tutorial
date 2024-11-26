import { Body, ConflictException, Controller, HttpCode, HttpException, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller(process.env.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(process.env.Login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      console.log(loginDto)
      const user = await this.authService.validateUser(email, password);

      if (!user) {
        throw new ConflictException({
          message: 'incorrect email or password',
          statusCode: HttpStatus.CONFLICT
        });
      }
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }
}
