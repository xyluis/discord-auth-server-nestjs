import 'fastify'
import { JWTUserDTO } from './dtos/user.dto'

declare module 'fastify' {
  export interface FastifyRequest {
    user: JWTUserDTO
  }
}
