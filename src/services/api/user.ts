import Api from "@/api/api";
import UserModule, { User } from "@/store/modules/user";
import {
  CreateUserDto,
  PatchUserDto,
  SearchUserDto,
  UserSearchResult,
} from "../user";

export default class UserService {
  public async patchUser({ id, data }: PatchUserDto): Promise<void> {
    const savedUser: User = await Api.patch(`/users/${id}`, data);
    UserModule.add([savedUser]);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = await Api.post("/users", createUserDto);
    await UserModule.saveUsers([user]);

    return user;
  }

  public async searchUsers(
    searchUserDto: SearchUserDto
  ): Promise<UserSearchResult> {
    const result: UserSearchResult = await Api.post(
      "/users/search",
      searchUserDto
    );
    await UserModule.saveUsers(result.items);

    return result;
  }
}
