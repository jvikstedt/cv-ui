<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        :name="name"
        readonly
        v-bind="attrs"
        v-on="on"
        :rules="rules"
        :clearable="!readonly"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      type="month"
      scrollable
      v-if="modal"
      :readonly="readonly"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";

export class YearMonth {
  year: number | null = null;
  month: number | null = null;
}

@Component
export default class MonthPicker extends Vue {
  @Prop({ required: false }) readonly value!: YearMonth;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ required: true }) readonly name!: string;
  @Prop({ required: false }) readonly rules!: InputValidationRules;
  @Prop({ required: false }) readonly readonly!: boolean;

  date: string | null = null;
  menu = false;
  modal = false;

  created(): void {
    if (this.value && this.value.year && this.value.month) {
      this.date = `${this.value.year}-${("0" + this.value.month).slice(-2)}`;
    } else {
      this.updateValue(new YearMonth());
    }
  }

  @Watch("value")
  async valueChanged(yearMonth: YearMonth): Promise<void> {
    if (yearMonth.year && yearMonth.month) {
      this.date = `${yearMonth.year}-${("0" + yearMonth.month).slice(-2)}`;
    } else {
      this.date = null;
    }
  }

  @Watch("date")
  async dateChanged(date: string | null): Promise<void> {
    if (date) {
      const [year, month] = date.split("-");
      this.updateValue({
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });
    } else {
      this.updateValue(new YearMonth());
    }
  }

  @Emit("input")
  updateValue(yearMonth: YearMonth | null): YearMonth | null {
    return yearMonth;
  }
}
</script>
