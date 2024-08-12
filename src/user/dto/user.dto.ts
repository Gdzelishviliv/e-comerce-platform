import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@ObjectType()
export class UserDto {
    @Field(() => ID)
    id: string;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
    email: string;

    @Field()
    isActive: boolean;

    @Field({ nullable: true })
    avatar?: string;
}

@InputType()
export class CreateUserInput {
    @Field()
    @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
    email: string;

    @Field()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field({ nullable: true })
    @IsOptional()
    avatar?: string;
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
    email?: string;

    @Field({ nullable: true })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    @IsOptional()
    avatar?: string;
}
