import { Role } from './role';

export class User {
  userId?: string;
  email: string;
  password: string;
  name?: string;
  avatar: string;
  isUser?:boolean;
  role: Role[];
  token?: string;
  username?: string;
}
