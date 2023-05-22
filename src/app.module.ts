import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ApiController } from './controllers/api.controller';
import { PrismaService } from './services/prisma.service';
import { LoginService } from './services/login.service';
import { DiscordService } from './services/discord.service';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [HealthController, AuthController, ApiController],
  providers: [AuthService, PrismaService, LoginService, DiscordService],
})
export class AppModule {}
