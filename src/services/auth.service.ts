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

    await this.login.getLogin({
      accessToken,
      expiresIn,
      id: user.id,
      refreshToken,
    })

    const token = this.jwtService.sign(
      {
        tag: `${user.username}#${user.discriminator}`,
        decorationUrl:
          user.avatar_decoration &&
          `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration}.png?size=160&passthrough=true`,
        avatarUrl: getUserAvatarUrl(user.id, user.discriminator, user.avatar),
      },
      {
        subject: user.id,
        expiresIn,
      },
    )

    return { token, expiration: expiresIn }
  }
}
