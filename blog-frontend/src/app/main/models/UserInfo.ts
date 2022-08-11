import { Role } from "app/auth/models";

export class UserInfo {
    username: string;
    avatar: string;
    name: string;
    role: Role[];
    email: string;
}