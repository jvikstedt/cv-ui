import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";

export class AlertInfo {
  message!: string;
  color = "primary";
  y = "top";
  x = "";
  mode = "";
  timeout = 5000;
  details: string | null = null;

  public constructor(init?: Partial<AlertInfo>) {
    Object.assign(this, init);
  }
}

@Module({
  dynamic: true,
  namespaced: true,
  name: "alert",
  store,
})
class AlertModule extends VuexModule {
  public alert: AlertInfo | null = null;

  get newAlert(): AlertInfo | null {
    return this.alert;
  }

  @Mutation
  public resetAlert(): void {
    this.alert = null;
  }

  @Mutation
  public setAlert(alert: AlertInfo): void {
    this.alert = alert;
  }
}

export default getModule(AlertModule);
