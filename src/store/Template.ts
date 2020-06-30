import { Model } from "@vuex-orm/core";

import { AttrField, OrmModel, PrimaryKey } from "vuex-orm-decorators";

@OrmModel("templates")
export default class Template extends Model {
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  @AttrField(undefined)
  public name!: string;

  @AttrField(undefined)
  public exporter!: string;

  @AttrField(undefined)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data!: any;

  @AttrField(undefined)
  public createdAt!: string;

  @AttrField(undefined)
  public updatedAt!: string;
}
