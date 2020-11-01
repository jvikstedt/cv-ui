import PlaygroundService from "./playground/user";
import ApiService from "./api/user";
import { User } from "@/store/modules/user";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  location: string;
  workExperienceInYears: number;
  email: string;
}

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

export interface SearchUserDto {
  email?: string;

  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface UserSearchResult {
  items: User[];
  total: number;
}

export interface Service {
  createUser(createUserDro: CreateUserDto): Promise<User>;
  patchUser(patchUserDto: PatchUserDto): Promise<void>;
  searchUsers(searchUserDto: SearchUserDto): Promise<UserSearchResult>;
}
