import { Model } from "@vuex-orm/core";
import User from "@/store/User";
import Skill from "@/store/Skill";

import {
  AttrField,
  OrmModel,
  PrimaryKey,
  HasManyField,
  BelongsToField
} from "vuex-orm-decorators";

@OrmModel("cvs")
export default class CV extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  @AttrField(undefined)
  public userId!: number;

  @AttrField(undefined)
  public description!: string;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;

  @BelongsToField(User, "userId")
  public user!: User;

  @HasManyField(Skill, "cvId")
  public skills!: Skill[];
}
