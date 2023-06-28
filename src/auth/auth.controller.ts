import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    const { email, password } = credentials;
    const token = await this.authService.signIn({ email, password });
    return { token };
  }
}
