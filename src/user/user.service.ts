import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (input.password) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      user.password = hashedPassword;
    }

    if (input.username) {
      user.username = input.username;
    }
    if (input.email) {
      user.email = input.email;
    }
    if (input.avatar) {
      user.avatar = input.avatar;
    }

    await user.save();
    return user;
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
