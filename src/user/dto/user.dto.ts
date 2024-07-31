import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Matches } from 'class-validator';

const EMAIL_REGEX = /^(?!\.)(""|[\w&'*+._%+-]+(?:(?<=\.)|\(?[0-9]+(?:-[0-9]+)?\)?)?)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;


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
    email: string;

    @Field()
    isActive: boolean;
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
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    username?: string;
}
