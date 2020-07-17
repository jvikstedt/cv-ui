import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DialogComponent } from "@/dialog";

const DialogStore = namespace("DialogStore");

@Component
export default class DialogMixin extends Vue {
  @DialogStore.Mutation
  popDialogComponent!: () => void;

  @DialogStore.Mutation
  pushDialogComponent!: (dialogComponent: DialogComponent) => void;
}
