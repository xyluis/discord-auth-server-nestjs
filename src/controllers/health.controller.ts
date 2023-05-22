import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @HttpCode(200)
  @Get()
  async sendHealth() {
    return { ok: true };
  }
}
