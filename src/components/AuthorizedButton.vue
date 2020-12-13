<template>
  <v-tooltip bottom :disabled="valid">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <slot name="btn" :valid="valid"></slot>
      </div>
    </template>
    <span>{{ errorTooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Api from "@/api/api";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class AuthorizedButton extends Vue {
  @Prop({ required: true }) readonly errorTooltip!: string;
  @Prop({ required: true }) readonly endpoint!: string;
  @Prop({ required: true }) readonly method!: string;

  valid = false;

  async created(): Promise<void> {
    try {
      switch (this.method) {
        case "delete":
          await Api.delete(`${this.endpoint}?dry=true`);
          break;
        case "get":
          await Api.get(`${this.endpoint}?dry=true`);
          break;
        case "post":
          await Api.post(`${this.endpoint}?dry=true`, {});
          break;
        case "patch":
          await Api.patch(`${this.endpoint}?dry=true`, {});
          break;
        default:
          break;
      }
      this.valid = true;
    } catch (err) {
      this.valid = false;
    }
  }
}
</script>
