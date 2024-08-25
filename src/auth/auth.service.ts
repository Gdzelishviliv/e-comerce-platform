import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserInput } from "./dto/register.dto";
import { User } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        console.log('Email:', email);
        console.log('Password:', password);

        if (!email || !password) {
            throw new BadRequestException('Email and password must be provided');
        }

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // აქ მომხმარებლის აქტიურობას ვამოწმებთ
        if (!user.isActive) {
            throw new UnauthorizedException('Your account is deactivated. Please contact support.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }


    async login(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(input: CreateUserInput): Promise<User> {
        const existingUser = await this.userService.findByEmail(input.email);
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }
        return this.userService.create(input);
    }
}
