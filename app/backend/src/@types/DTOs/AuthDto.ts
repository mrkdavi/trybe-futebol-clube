export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface ValidateTokenResponse {
  role: string;
}

export interface UserTokenDto {
  id: number;
  role: string;
}
