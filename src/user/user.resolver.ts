import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDto, CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private userService: UserService) { }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isActive: user.isActive
    }
  }

  @Mutation(() => UserDto)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserDto> {
    const user = await this.userService.create(input);
    return this.mapToUserDto(user);
  }

  @Mutation(() => UserDto)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.update(id, input);
    return this.mapToUserDto(updatedUser);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }

  @Mutation(() => UserDto)
  async deactivateUser(@Args('id') id: string): Promise<UserDto> {
    const user = await this.userService.deactivate(id);
    return this.mapToUserDto(user);
  }

  @Mutation(() => UserDto)
  async activateUser(@Args('id') id: string): Promise<UserDto> {
    const user = await this.userService.activate(id);
    return this.mapToUserDto(user);
  }

  @Query(() => UserDto)
  async user(@Args('id') id: string): Promise<UserDto> {
    const user = await this.userService.findById(id);
    return this.mapToUserDto(user);
  }
}
