import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { VersioningType } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.enableCors({
    origin: '*',
    methods: '*',
  })

  await app.listen(process.env.PORT || 3333, '0.0.0.0')
}

bootstrap()
