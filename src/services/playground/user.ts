import * as R from "ramda";
import ApiService from "@/services/api/user";
import UserModule, { User } from "@/store/modules/user";
import { SortArrayOfNumbers } from "@/helpers";
import {
  CreateUserDto,
  PatchUserDto,
  SearchUserDto,
  UserSearchResult,
} from "../user";

export default class UserService extends ApiService {
  private fakedUsers: User[] = [];

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const id =
      (R.defaultTo(
        0,
        R.last(SortArrayOfNumbers(UserModule.allIds))
      ) as number) + 1;

    const user = {
      ...createUserDto,
      id,
      username: createUserDto.email,
      avatarId: "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fakedUsers.push(user);
    await UserModule.saveUsers([user]);
    return user;
  }

  public async patchUser({ id, data }: PatchUserDto): Promise<void> {
    const originalUser = UserModule.find(id);
    if (!originalUser) {
      return;
    }
    const user = {
      ...originalUser,
      ...data,
    };

    UserModule.add([user]);
  }

  public async searchUsers(
    searchUserDto: SearchUserDto
  ): Promise<UserSearchResult> {
    const result = await super.searchUsers(searchUserDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedUsers],
      total: total + R.length(this.fakedUsers),
    };
  }
}
