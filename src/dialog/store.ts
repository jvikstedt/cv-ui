import * as R from "ramda";
import { VuexModule, Module, Mutation } from "vuex-module-decorators";

export class DialogComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component!: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any = {};
}

@Module({ namespaced: true })
export class DialogStore extends VuexModule {
  public dialogComponents: DialogComponent[] = [];

  get currentDialogComponent(): DialogComponent | null {
    return R.last(this.dialogComponents) || null;
  }

  @Mutation
  public pushDialogComponent(dialogComponent: DialogComponent): void {
    this.dialogComponents = [...this.dialogComponents, dialogComponent];
  }

  @Mutation
  public popDialogComponent(): void {
    this.dialogComponents = R.remove(
      this.dialogComponents.length - 1,
      1,
      this.dialogComponents
    );
  }
}
