<template>
  <div>
    <v-autocomplete
      v-model="selectedSkillSubject"
      name="skill"
      :items="skillSubjects"
      :search-input.sync="searchInput"
      item-text="name"
      item-value="id"
      label="Skill"
      placeholder="Start typing to search"
      return-object
      @change="onSelect"
    ></v-autocomplete>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Calculation</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in membershipSkillRows" :key="m.skillSubjectId">
            <td>{{ m.skillSubjectName }}</td>
            <td>
              <v-checkbox
                :input-value="m.automaticCalculation"
                @change="updateAutomaticCalculation(m, $event)"
                label="Auto"
              ></v-checkbox>

              <v-text-field
                :value="m.experienceInYears"
                label="Experience in years"
                :rules="experienceInYearsRule"
                type="number"
                v-if="!m.automaticCalculation"
                @change="updateExperienceInYears(m, $event)"
              />
            </td>
            <td>
              <v-btn
                icon
                @click.prevent="deleteRow(m)"
                class="remove-skill-btn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { MembershipSkillDto } from "@/store/modules/membership_skill";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import { IsRequired } from "@/helpers/validator";

interface MembershipSkillRow {
  skillSubjectId: number;
  skillSubjectName: string;
  automaticCalculation: boolean;
  experienceInYears: number;
}

@Component
export default class MembershipSkillsField extends Vue {
  @Prop({ required: true }) readonly value!: MembershipSkillDto[];

  searchInput = null;
  selectedSkillSubject: SkillSubject | null = null;
  skillSubjects: SkillSubject[] = [];

  experienceInYearsRule = [IsRequired()];

  async created(): Promise<void> {
    await this.searchInputChanged("");
  }

  get membershipSkillRows(): MembershipSkillRow[] {
    return R.sort(
      (a, b) => a.skillSubjectName.localeCompare(b.skillSubjectName),
      R.reject(
        R.isNil,
        R.map((dto) => {
          const skillSubject = SkillSubjectModule.find(dto.skillSubjectId);
          if (!skillSubject) {
            return undefined;
          }

          return {
            skillSubjectId: dto.skillSubjectId,
            skillSubjectName: skillSubject.name,
            automaticCalculation: dto.automaticCalculation,
            experienceInYears: dto.experienceInYears,
          };
        }, this.value)
      ) as MembershipSkillRow[]
    );
  }

  @Watch("searchInput")
  async searchInputChanged(input: string): Promise<void> {
    const skillSubjects = await SkillSubjectModule.searchSkillSubjects({
      name: input || "",
      limit: 10,
    });

    this.skillSubjects = R.reject(
      (skillSubject: SkillSubject) =>
        !!R.find(
          (membershipSkill: MembershipSkillDto) =>
            R.equals(membershipSkill.skillSubjectId, skillSubject.id),
          this.value
        ),
      skillSubjects
    );
  }

  onSelect(skillSubject: SkillSubject): void {
    this.$nextTick(() => {
      this.selectedSkillSubject = null;
    });

    this.updateValue([
      ...this.value,
      {
        skillSubjectId: skillSubject.id,
        automaticCalculation: true,
        experienceInYears: 0,
      },
    ]);
  }

  deleteRow(row: MembershipSkillRow): void {
    this.updateValue(
      R.reject(
        (m) => R.equals(m.skillSubjectId, row.skillSubjectId),
        this.value
      )
    );
  }

  updateAutomaticCalculation(
    row: MembershipSkillRow,
    val: boolean | null
  ): void {
    this.updateValue(
      R.map((m) => {
        if (R.equals(m.skillSubjectId, row.skillSubjectId)) {
          return {
            ...m,
            automaticCalculation: !!val,
          };
        }
        return m;
      }, this.value)
    );
  }

  updateExperienceInYears(row: MembershipSkillRow, val: string): void {
    const experienceInYears = parseFloat(val);

    this.updateValue(
      R.map((m) => {
        if (R.equals(m.skillSubjectId, row.skillSubjectId)) {
          return {
            ...m,
            experienceInYears,
          };
        }
        return m;
      }, this.value)
    );
  }

  @Emit("input")
  updateValue(membershipSkills: MembershipSkillDto[]): MembershipSkillDto[] {
    return membershipSkills;
  }
}
</script>