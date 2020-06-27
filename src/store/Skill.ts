import { Model } from "@vuex-orm/core";
import SkillSubject from "@/store/SkillSubject";

import {
  AttrField,
  OrmModel,
  PrimaryKey,
  BelongsToField
} from "vuex-orm-decorators";

@OrmModel("skills")
export default class Skill extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  @AttrField(undefined)
  experienceInYears!: number;

  @AttrField(undefined)
  public cvId!: number;

  @AttrField(undefined)
  public skillSubjectId!: number;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;

  @BelongsToField(SkillSubject, "skillSubjectId")
  public skillSubject!: SkillSubject;
}
