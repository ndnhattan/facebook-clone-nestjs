import { User } from '../utils/typeorm';
import { ValidateUserDetails } from '../utils/types';

export interface IAuthService {
  validateUser(userCredentials: ValidateUserDetails): Promise<User | null>;
  login(userCredentials: ValidateUserDetails);
  refreshToken(refreshToken: string);
  logout(id: number);
}
