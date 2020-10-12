import Api from "@/api/api";
import UserModule, { User } from "@/store/modules/user";
import { PatchUserDto } from "../user";

export default class UserService {
  public async patchUser({ id, data }: PatchUserDto): Promise<void> {
    const savedUser: User = await Api.patch(`/users/${id}`, data);
    UserModule.add([savedUser]);
  }
}
