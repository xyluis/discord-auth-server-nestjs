import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { getUserAvatarUrl } from '../utils/get-user-avatar-url.util';
import { LoginService } from './login.service';
import { UserDTO } from '../dtos/user.dto';
import { DiscordService } from './discord.service';

@Injectable()
export class AuthService {
  constructor(
    private login: LoginService,
    private discord: DiscordService,
    private jwtService: JwtService,
  ) {}

  async getUser({ access_token, expires_in, refresh_token }: UserDTO) {
    const user = await this.discord.getUser(access_token);

    await this.login.getLogin({
      access_token,
      expires_in,
      id: user.id,
      refresh_token,
    });

    const token = this.jwtService.sign(
      {
        tag: user.username,
        decorationUrl:
          user.avatar_decoration &&
          `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration}.png?size=160&passthrough=true`,
        avatarUrl: getUserAvatarUrl(user.id, user.avatar),
      },
      {
        subject: user.id,
        expiresIn: expires_in,
      },
    );

    return { token, expiration: expires_in };
  }
}
