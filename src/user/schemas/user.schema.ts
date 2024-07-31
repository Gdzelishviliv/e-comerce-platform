import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true,unique:true })
  email: string;

  @Prop({ required: true,select:false })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: true })
  isActive: boolean;
  _id: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
