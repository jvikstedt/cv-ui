import ApiService from "@/services/api/user";
import UserModule from "@/store/modules/user";
import { PatchUserDto } from "../user";

export default class UserService extends ApiService {
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
}
