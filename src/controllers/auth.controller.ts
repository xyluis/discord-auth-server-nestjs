import {
  Controller,
  Get,
  Headers,
  Req,
  Res,
  Version,
} from '@nestjs/common'
import { z } from 'zod'
import { URL } from 'node:url'

import { AuthService } from '../services/auth.service'
import { DiscordService } from '../services/discord.service'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly discordService: DiscordService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('discord')
  @Version('1')
  async authenticate(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const querySchema = z.object({
      code: z.string().optional(),
    })

    const redirectUrl = new URL(process.env.CLIENT_REDIRECT_URI)
    const { code } = querySchema.parse(request.query)

    if (!code) {
      return response
      .status(302)
      .redirect(redirectUrl.href)
    }

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = await this.discordService.getAccessToken(code)

    const { token, expiration } = await this.authService.getUser({
      accessToken,
      expiresIn,
      refreshToken,
    })

    redirectUrl.searchParams.append('token', token)
    redirectUrl.searchParams.append('expiration', expiration.toString())

    return response
      .status(302)
      .redirect(redirectUrl.href)
  }

  @Get('verify')
  @Version('1')
  async verifyToken(@Headers('Authorization') authorization: string) {
    const [, token] = authorization.split(' ')

    const decoded = this.jwtService.decode(token)

    return {
      decoded,
    }
  }
}
