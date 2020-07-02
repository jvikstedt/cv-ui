import Api from "@/api/api";
import User from "@/store/User";

export interface PatchUserDto {
  firstName?: string;
  lastName?: string;
  avatarId?: string;
}

export const PatchUser = async (
  userId: number,
  patchUserDto: PatchUserDto
): Promise<User> => {
  const user = await Api.patch(`/users/${userId}`, patchUserDto);

  User.insert({
    data: user
  });

  return user;
};
