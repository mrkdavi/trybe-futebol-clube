import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export default class AuthController {
  static async login(req: Request, res: Response) {
    const token = await AuthService.login(req.body);
    res.status(200).json(token);
  }

  static async validateToken(req: Request, res: Response) {
    const { authorization } = req.headers;
    const role = await AuthService.validateToken(authorization as string);
    res.status(200).json(role);
  }
}
