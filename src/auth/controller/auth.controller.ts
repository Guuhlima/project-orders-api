import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: any): Promise<string> {
        return this.authService.login(body.name, body.password);
    }

    @Post('register') 
    async register(@Body() body: any): Promise<string> {
        return this.authService.registerUser(body.name, body.password)
    }
}
