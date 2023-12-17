import {
  Controller,
  Get,
  HttpCode,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { AuthGuard } from '../guards/auth.guard'
import { DiscordService } from '../services/discord.service'
import { LoginService } from '../services/login.service'
import { isTokenExpired } from '../utils/is-token-expired.util'

@Controller()
export class ApiController {
  constructor(
    private readonly loginService: LoginService,
    private readonly discordService: DiscordService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/guilds/@me')
  @Version('1')
  async getGuilds(@Req() request: FastifyRequest) {
    let login = await this.loginService.getLoginById(request.user.sub)

    if (login && isTokenExpired(login.expiresIn)) {
      const refresh = await this.discordService.refreshAccessToken(
        login.refreshToken,
      )

      login = await this.loginService.updateTokens(login.id, {
        accessToken: refresh.access_token,
        refreshToken: refresh.refresh_token,
      })
    }

    const guilds = await this.discordService.getGuilds(login.accessToken)

    return { guilds }
  }

  @Get('discord/url')
  @HttpCode(200)
  @Version('1')
  sendAuthUrl() {
    const authScopes = ['identify', 'guilds']

    const searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      prompt: 'consent',
    })

    const authenticationUrl = `https://discord.com/oauth2/authorize?${searchParams.toString()}&scope=${authScopes.join(
      '%20',
    )}`

    return {
      url: authenticationUrl,
    }
  }
}
