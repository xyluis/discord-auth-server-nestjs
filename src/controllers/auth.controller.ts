import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { DiscordService } from '../services/discord.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly discordService: DiscordService,
  ) {}

  @Post('discord')
  async getUser(@Req() request: Request) {
    const bodySchema = z.object({
      code: z.string(),
    });

    const { code } = bodySchema.parse(request.body);

    const { access_token, refresh_token, expires_in } =
      await this.discordService.getAccessToken(code);

    return this.authService.getUser({
      access_token,
      expires_in,
      refresh_token,
    });
  }
}
