import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    image?: string;

    @Field(() => Boolean, { defaultValue: true })
    isActive?: boolean;
}
