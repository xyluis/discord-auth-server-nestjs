import { Injectable } from '@nestjs/common';
import { Login } from '@prisma/client';

import { PrismaService } from './prisma.service';
import { LoginDTO } from '../dtos/login.dto';
import { UpdateTokensDTO } from '../dtos/tokens.dto';

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async getLogin({
    id,
    access_token,
    expires_in,
    refresh_token,
  }: LoginDTO): Promise<Login> {
    let login = await this.prisma.login.findUnique({
      where: {
        id,
      },
    });

    if (!login) {
      login = await this.prisma.login.create({
        data: {
          id,
          access_token,
          expires_in,
          refresh_token,
        },
      });
    }

    return login;
  }

  async getLoginById(id: string): Promise<Login | null> {
    return this.prisma.login.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTokens(
    id: string,
    { access_token, refresh_token }: UpdateTokensDTO,
  ): Promise<Login> {
    return this.prisma.login.update({
      where: {
        id,
      },
      data: {
        access_token,
        refresh_token,
      },
    });
  }
}
