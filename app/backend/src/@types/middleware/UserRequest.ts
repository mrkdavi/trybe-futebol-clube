import { Request } from 'express';
import { UserTokenDto } from '../DTOs/AuthDto';

export interface UserRequest extends Request {
  user: UserTokenDto;
}
