import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(input: CreateUserInput): Promise<User> {
    const { email, password, username, avatar } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword, username, avatar });
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, input, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async deactivate(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async activate(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).exec();
  }
}
