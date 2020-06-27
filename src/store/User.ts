import { Model } from "@vuex-orm/core";

import { AttrField, OrmModel, PrimaryKey } from "vuex-orm-decorators";

@OrmModel("users")
export default class User extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  @AttrField(undefined)
  public username!: string;

  @AttrField(undefined)
  public firstName!: string;

  @AttrField(undefined)
  public lastName!: string;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;
}
