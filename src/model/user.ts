export class User {
  id!: number;

  username!: string;

  firstName!: string;

  lastName!: string;

  avatarId!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchUserDtoData {
  firstName!: string;

  lastName!: string;

  avatarId!: string;
}

export class PatchUserDto {
  id!: number;
  data!: PatchUserDtoData;
}

export class TokenData {
  cvIds!: number[];
  firstName!: string;
  lastName!: string;
  userId!: number;
  templateIds!: number[];
  username!: string;
}
