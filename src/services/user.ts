import PlaygroundService from "./playground/user";
import ApiService from "./api/user";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchUserDtoData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  workExperienceInYears?: number;
  email?: string;
  avatarId?: string;
}

export interface PatchUserDto {
  id: number;
  data: PatchUserDtoData;
}

export interface Service {
  patchUser(patchUserDto: PatchUserDto): Promise<void>;
}
