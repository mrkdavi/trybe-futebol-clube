import { sign, verify } from 'jsonwebtoken';
import { TokenResponse, UserTokenDto } from '../@types/DTOs/AuthDto';

export const verifyToken = (token: string): UserTokenDto => {
  const { JWT_SECRET } = process.env;
  return verify(token, JWT_SECRET as string) as UserTokenDto;
};
export const generateToken = (user: UserTokenDto): TokenResponse => {
  const token = sign(user, process.env.JWT_SECRET as string);
  return { token };
};
