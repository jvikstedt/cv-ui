import { Module, VuexModule, Mutation } from "vuex-module-decorators";

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

@Module({ namespaced: true })
export class AlertStore extends VuexModule {
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
