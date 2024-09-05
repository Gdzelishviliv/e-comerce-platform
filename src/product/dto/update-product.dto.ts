import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
