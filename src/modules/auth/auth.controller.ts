import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from 'src/common/decorators/get-current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return { 
      message: 'Logout successful',
      data
    };
  }

  @Post('logout')
  @UseGuards(UserGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: any ): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    return { message: 'Logout successful' };
  }
}
