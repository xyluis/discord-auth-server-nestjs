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

  app.enableCors({
    origin: '*',
    methods: '*',
  })
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })


  await app.listen(process.env.PORT || 3333, '0.0.0.0')
}

bootstrap()
