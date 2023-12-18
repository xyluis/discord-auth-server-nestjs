import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { getUserAvatarUrl } from '../utils/get-user-avatar-url.util'
import { LoginService } from './login.service'
import { UserDTO } from '../dtos/user.dto'
import { DiscordService } from './discord.service'

@Injectable()
export class AuthService {
  constructor(
    private login: LoginService,
    private discord: DiscordService,
    private jwtService: JwtService,
  ) {}

  async getUser({ accessToken, expiresIn, refreshToken }: UserDTO) {
    const user = await this.discord.getUser(accessToken)

    console.log(user)

    await this.login.getLogin({
      accessToken,
      expiresIn,
      id: user.id,
      refreshToken,
    })

    const token = this.jwtService.sign(
      {
        username: user.username,
        globalName: user.global_name ?? 'User',
        decorationUrl:
          user.avatar_decoration_data ?
          `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png` : null,
        avatarUrl: getUserAvatarUrl(user.id, user.avatar),
      },
      {
        subject: user.id,
        expiresIn,
      },
    )

    return { token, expiration: expiresIn }
  }
}
