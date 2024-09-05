import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Product {
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    description?: string;

    @Prop()
    image?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [{ type: String }], default: [] })
    reviews: string[];

    @Prop({ type: [{ type: String, ref: 'User' }], default: [] })
    purchasedBy: User[];
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
