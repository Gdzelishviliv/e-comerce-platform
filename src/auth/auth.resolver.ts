import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../user/dto/user.dto';
import { User } from '../user/schemas/user.schema';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    async login(@Args('input') input: LoginInput): Promise<string> {
        console.log('Login input:', input);
        const { email, password } = input;
        const result = await this.authService.login(email, password);
        console.log("token",`--> ${result.access_token}`)
        return result.access_token;
    }

    @Mutation(() => User)
    async register(@Args('input') input: CreateUserInput): Promise<User> {
        return this.authService.register(input);
    }
}
