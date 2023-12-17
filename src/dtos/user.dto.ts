export interface UserDTO {
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface JWTUserDTO {
  username: string
  globalName: string | null
  decorationUrl: string | null
  avatarUrl: string
  sub: string
}
