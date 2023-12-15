import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

import { getGuildIconUrl } from '../utils/get-guild-icon-url.util';

const tokenResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

@Injectable()
export class DiscordService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://discord.com/api/v10',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async getAccessToken(code: string) {
    const { data } = await this.api.post(`oauth2/token`, {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    return tokenResponse.parse(data);
  }

  async getUser(token: string) {
    const { data } = await this.api.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userSchema = z.object({
      id: z.string(),
      username: z.string(),
      avatar: z.string().optional(),
      avatar_decoration: z.string().optional(),
    });

    return userSchema.parse(data);
  }

  async getGuilds(token: string) {
    const [guildsResponse, botGuildsResponse] = await Promise.all([
      this.api.get('/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      this.api.get('/users/@me/guilds', {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
        },
      }),
    ]);

    const guildSchema = z.object({
      id: z.string(),
      name: z.string(),
      owner: z.boolean(),
      icon: z.string().nullable(),
      permissions: z.coerce.number(),
    });

    const guildsSchema = z.array(guildSchema);

    const userGuilds = guildsSchema.parse(guildsResponse.data);
    const botGuilds = guildsSchema.parse(botGuildsResponse.data);

    const guilds =
      userGuilds
        .filter((guild) => {
          return botGuilds.find((botGuild) => botGuild.id === guild.id);
        })
        .map((guild) => ({
          ...guild,
          canManage: (guild.permissions & (1 << 5)) !== 0 || guild.owner,
          iconUrl: getGuildIconUrl(guild.id, guild.icon),
        })) ?? [];

    return guilds;
  }

  async refreshAccessToken(refresh_token: string) {
    const { data } = await this.api.post('/oauth2/token', {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token,
    });

    return tokenResponse.parse(data);
  }
}
