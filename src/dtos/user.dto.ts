export interface UserDTO {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface JWTUserDTO {
  tag: string;
  decorationUrl: string | null;
  avatarUrl: string;
  sub: string;
}
