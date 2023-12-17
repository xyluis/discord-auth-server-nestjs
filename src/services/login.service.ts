import { Injectable } from '@nestjs/common'
import { Login } from '@prisma/client'

import { PrismaService } from './prisma.service'
import { LoginDTO } from '../dtos/login.dto'
import { UpdateTokensDTO } from '../dtos/tokens.dto'

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async getLogin({
    id,
    accessToken,
    expiresIn,
    refreshToken,
  }: LoginDTO): Promise<Login> {
    let login = await this.prisma.login.findUnique({
      where: {
        id,
      },
    })

    if (!login) {
      login = await this.prisma.login.create({
        data: {
          id,
          accessToken,
          expiresIn,
          refreshToken,
        },
      })
    }

    return login
  }

  async getLoginById(id: string): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: {
        id,
      },
    })
  }

  async updateTokens(
    id: string,
    { accessToken, refreshToken }: UpdateTokensDTO,
  ): Promise<Login> {
    return this.prisma.login.update({
      where: {
        id,
      },
      data: {
        accessToken,
        refreshToken,
      },
    })
  }
}
