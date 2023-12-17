export interface UserDTO {
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface JWTUserDTO {
  tag: string
  decorationUrl: string | null
  avatarUrl: string
  sub: string
}
