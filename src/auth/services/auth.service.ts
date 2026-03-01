import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    async login(user: string, password: string): Promise<string> {
        return `Hello from login! ${user}`;
    }

    async registerUser(user: string, password: string): Promise<string> {
        return `Hello from register! ${user}`;
    }
}