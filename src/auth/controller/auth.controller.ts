import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; password: string }) {
    const user = await this.authService.registerUser(body.name, body.password);
    return { message: 'Usuario registrado com sucesso', user };
  }

  @Post('login')
  async login(@Body() body: { name: string; password: string }) {
    const data = await this.authService.login(body.name, body.password);
    return { message: 'Login realizado com sucesso', ...data };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: { user: unknown }) {
    return { user: req.user };
  }
}
