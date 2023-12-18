import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { z } from 'zod'

import { getGuildIconUrl } from '../utils/get-guild-icon-url.util'

const tokenResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
})

@Injectable()
export class DiscordService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://discord.com/api/v10',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  async getAccessToken(code: string) {
    const { data } = await this.api.post(`oauth2/token`, {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    })

    return tokenResponse.parse(data)
  }

  async getUser(token: string) {
    const { data } = await this.api.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const userSchema = z.object({
      id: z.string(),
      username: z.string(),
      global_name: z.string().optional(),
      discriminator: z.string(),
      avatar: z.string().nullable(),
      avatar_decoration_data: z.object({
        asset: z.string().optional(),
        sku_id: z.string().optional()
      }).optional(),
    })

    console.log(data)

    return userSchema.parse(data)
  }

  async getGuilds(token: string) {
    try {
      const [guildsResponse, /* botGuildsResponse */] = await Promise.all([
        this.api.get('/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        /* this.api.get('/users/@me/guilds', {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
          },
        }), */
      ])

      const guildSchema = z.object({
        id: z.string(),
        name: z.string(),
        owner: z.boolean(),
        icon: z.string().nullable(),
        permissions: z.coerce.number(),
      })

      const guildsSchema = z.array(guildSchema)

      const userGuilds = guildsSchema.parse(guildsResponse.data)
      /* const botGuilds = guildsSchema.parse(botGuildsResponse.data) */

      const guilds =
        userGuilds
        .map((guild) => ({
          ...guild,
          canManage: (guild.permissions & (1 << 5)) !== 0 || guild.owner,
          iconUrl: getGuildIconUrl(guild.id, guild.icon),
        }))
         /*  .filter((guild) => {
            return botGuilds.find((botGuild) => botGuild.id === guild.id)
          })
          .map((guild) => ({
            ...guild,
            canManage: (guild.permissions & (1 << 5)) !== 0 || guild.owner,
            iconUrl: getGuildIconUrl(guild.id, guild.icon),
          })) ?? [] */

      return guilds
    } catch (e) {
      return []
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const { data } = await this.api.post('/oauth2/token', {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    return tokenResponse.parse(data)
  }
}
