import { compare } from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/token';
import { LoginData, TokenResponse, ValidateTokenResponse } from '../@types/DTOs/AuthDto';
import { Unauthorized } from '../@types/errors';
import UserModel from '../database/models/User';

export default class TeamService {
  static async login({ email, password }: LoginData): Promise<TokenResponse> {
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new Unauthorized('Incorrect email or password');
    }

    if (!await compare(password, user.password)) {
      throw new Unauthorized('Incorrect email or password');
    }

    const token = generateToken({ id: user.id, role: user.role });

    return token;
  }

  static async validateToken(authorization: string): Promise<ValidateTokenResponse> {
    try {
      const { role } = verifyToken(authorization);
      return { role };
    } catch (e) {
      throw new Unauthorized('Expired or invalid token');
    }
  }
}
