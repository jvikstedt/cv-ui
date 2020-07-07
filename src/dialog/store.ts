import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

export class ShowDialogDto {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component!: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any = {};
}

@Module({ namespaced: true })
export class DialogStore extends VuexModule {
  public isOpen = false;
  public showDialogDto: ShowDialogDto | null = null;

  @Mutation
  public showDialog(showDialogDto: ShowDialogDto): void {
    this.isOpen = true;
    this.showDialogDto = showDialogDto;
  }

  @Mutation
  public hideDialog(): void {
    this.isOpen = false;
    this.showDialogDto = null;
  }

  @Action
  public showDialogAction(showDialogDto: ShowDialogDto): void {
    this.context.commit("showDialog", showDialogDto);
  }

  @Action
  public hideDialogAction(): void {
    this.context.commit("hideDialog");
  }
}
