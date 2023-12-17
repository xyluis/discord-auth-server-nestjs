import 'express'
import { JWTUserDTO } from './dtos/user.dto'

declare module 'express' {
  export interface Request {
    user: JWTUserDTO
  }
}
