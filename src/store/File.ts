import { Model } from "@vuex-orm/core";

import { AttrField, OrmModel, PrimaryKey } from "vuex-orm-decorators";

@OrmModel("files")
export default class File extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: string;

  @AttrField(undefined)
  public originalname!: string;

  @AttrField(undefined)
  public encoding!: string;

  @AttrField(undefined)
  public mimetype!: string;

  @AttrField(undefined)
  public destination!: string;

  @AttrField(undefined)
  public filename!: string;

  @AttrField(undefined)
  public path!: string;

  @AttrField(undefined)
  public size!: number;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;
}
