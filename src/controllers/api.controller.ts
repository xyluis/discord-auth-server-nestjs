import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { AuthGuard } from '../guards/auth.guard';
import { DiscordService } from '../services/discord.service';
import { LoginService } from '../services/login.service';
import { isTokenExpired } from '../utils/is-token-expired.util';

@Controller('api')
export class ApiController {
  constructor(
    private readonly loginService: LoginService,
    private readonly discordService: DiscordService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/guilds/@me')
  async getGuilds(@Req() request: FastifyRequest) {
    let login = await this.loginService.getLoginById(request.user.sub);

    if (login && isTokenExpired(login.expires_in)) {
      const refresh = await this.discordService.refreshAccessToken(
        login.refresh_token,
      );

      login = await this.loginService.updateTokens(login.id, {
        access_token: refresh.access_token,
        refresh_token: refresh.refresh_token,
      });
    }

    const guilds = await this.discordService.getGuilds(login.access_token);

    return { guilds };
  }
}
