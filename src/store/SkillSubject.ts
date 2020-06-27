import { Model } from "@vuex-orm/core";

import { AttrField, OrmModel, PrimaryKey } from "vuex-orm-decorators";

@OrmModel("skillSubjects")
export default class SkillSubject extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  @AttrField(undefined)
  public name!: string;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;
}
