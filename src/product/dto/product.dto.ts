import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { UserDto } from 'src/user/dto/user.dto';

@ObjectType()
export class ProductDto {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    description?: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    image?: string;

    @Field(() => Boolean)
    isActive: boolean;
    
    @Field(() => [UserDto])
    purchasedBy: UserDto[];
}
