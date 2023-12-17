import {
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  Version,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { AuthService } from '../services/auth.service'
import { DiscordService } from '../services/discord.service'
import { JwtService } from '@nestjs/jwt'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly discordService: DiscordService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('discord')
  @Version('1')
  async getUser(@Req() request: FastifyRequest) {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = await this.discordService.getAccessToken(code)

    return this.authService.getUser({
      accessToken,
      expiresIn,
      refreshToken,
    })
  }

  @Get('discord')
  @Version('1')
  async authenticate(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const querySchema = z.object({
      code: z.string().optional(),
    })

    const { code } = querySchema.parse(request.query)

    if (!code) {
      return reply
      .status(302)
      .redirect(
        process.env.CLIENT_REDIRECT_URI
      )
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

    return reply
      .status(302)
      .redirect(
        `${process.env.CLIENT_REDIRECT_URI}?token=${token}&expiration=${expiration}`,
      )
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
