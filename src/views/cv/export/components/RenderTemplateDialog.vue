<template>
  <v-card :loading="fetching">
    <v-card-title class="headline">
      Template: {{ template.name }}
    </v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="onCancel"> Cancel </v-btn>
    </v-card-actions>

    <v-card-text>
      <object
        v-if="template.exporter === 'pdf' && pdf"
        id="pdfviewer"
        v-bind:data="pdf"
        type="application/pdf"
        width="100%"
        height="750px"
      />
      <a
        v-if="template.exporter === 'docx' && docx"
        :download="docxFileName()"
        :href="docx"
        target="_blank"
      >
        Download docx
      </a>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import * as R from "ramda";
import { Component, Mixins, Prop } from "vue-property-decorator";
import { DialogFormMixin } from "@/mixins";
import { DateTime } from "luxon";
import ExportModule, { Template } from "@/store/modules/export";
import CVModule, { CV } from "@/store/modules/cv";
import SkillModule, { Skill } from "@/store/modules/skill";
import EducationModule from "@/store/modules/education";
import WorkExperienceModule from "@/store/modules/work_experience";
import ProjectMembershipModule from "@/store/modules/project_membership";
import { MembershipSkill } from "@/store/modules/membership_skill";

const calculateTotalSkillExperience = (
  skill: Skill,
  membershipSkills: MembershipSkill[]
): number => {
  const experience = R.reduce(
    (sum: number, membershipSkill) => {
      const projectMembership = membershipSkill.projectMembership;
      if (!projectMembership) {
        return sum;
      }

      if (!membershipSkill.automaticCalculation) {
        return sum + membershipSkill.experienceInYears;
      }

      const diff = (DateTime.utc(
        projectMembership.endYear || DateTime.utc().year,
        projectMembership.endMonth || DateTime.utc().month
      ).diff(
        DateTime.utc(projectMembership.startYear, projectMembership.startMonth),
        ["years"]
      ) as unknown) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (R.isNil(diff["values"]) || R.isNil(diff["values"].years)) {
        return sum;
      }

      return sum + diff["values"].years;
    },
    0,
    membershipSkills
  );

  const projectExperience = Math.round(experience * 100) / 100;

  const totalExperience =
    Math.round((projectExperience + skill.experienceInYears) * 100) / 100;

  return totalExperience;
};

@Component
export default class RenderTemplateDialog extends Mixins(DialogFormMixin) {
  @Prop({ required: true }) readonly cvId!: number;
  @Prop({ required: true }) readonly template!: Template;

  get cv(): CV | undefined {
    return CVModule.find(this.cvId);
  }

  get fetching(): boolean {
    return ExportModule.fetching;
  }

  get pdf(): string | null {
    return ExportModule.pdf;
  }

  get docx(): string | null {
    return ExportModule.docx;
  }

  docxFileName(): string {
    if (this.cv && this.cv.user) {
      return `${this.cv.user.firstName}-${this.cv.user.lastName}.docx`.toLowerCase();
    }
    return "noname.docx";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get exportData(): any {
    const cv = CVModule.find(this.cvId);
    if (!cv) {
      throw new Error(`Could not find cv ${this.cvId}`);
    }

    const skills = SkillModule.listByCV(this.cvId);
    const educations = EducationModule.listByCV(this.cvId);
    const workExperiences = WorkExperienceModule.listByCV(this.cvId);
    const projectMemberships = ProjectMembershipModule.listByCV(this.cvId);

    const allMembershipSkills = R.reject(
      R.isNil,
      R.flatten(R.map((m) => m.membershipSkills, projectMemberships))
    ) as MembershipSkill[];

    const calculatedSkills = R.map((skill) => {
      let membershipSkills = R.filter(
        (m) => R.equals(m.skillId, skill.id),
        allMembershipSkills
      );

      membershipSkills = R.map((m) => {
        const projectMembership = R.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => R.equals(p.id, m.projectMembershipId),
          projectMemberships
        );

        return {
          ...m,
          projectMembership,
        };
      }, membershipSkills);

      return {
        ...skill,
        experienceInYears: calculateTotalSkillExperience(
          skill,
          membershipSkills
        ),
      };
    }, skills);

    return {
      user: {
        cvId: cv.id,
        description: cv.description,
        updatedAt: cv.updatedAt,
        userId: cv.userId,
        username: cv.user.username,
        avatarId: cv.user.avatarId,
        firstName: cv.user.firstName,
        lastName: cv.user.lastName,
        jobTitle: cv.user.jobTitle,
        phone: cv.user.phone,
        location: cv.user.location,
        workExperienceInYears: cv.user.workExperienceInYears,
        email: cv.user.email,
      },
      skills: R.map(
        (skill) => ({
          id: skill.id,
          experienceInYears: skill.experienceInYears,
          interestLevel: skill.interestLevel,
          skillSubjectId: skill.skillSubject.id,
          name: skill.skillSubject.name,
          skillGroupId: skill.skillSubject.skillGroup.id,
          skillGroupName: skill.skillSubject.skillGroup.name,
          highlight: skill.highlight,
          disabled: false,
        }),
        calculatedSkills
      ),
      educations: R.map(
        (education) => ({
          schoolId: education.school.id,
          schoolName: education.school.name,
          startYear: education.startYear,
          endYear: education.endYear,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          description: education.description,
          highlight: education.highlight,
          disabled: false,
        }),
        educations
      ),
      jobs: R.map(
        (workExperience) => ({
          companyId: workExperience.company.id,
          companyName: workExperience.company.name,
          startYear: workExperience.startYear,
          startMonth: workExperience.startMonth,
          endYear: workExperience.endYear,
          endMonth: workExperience.endMonth,
          description: workExperience.description,
          jobTitle: workExperience.jobTitle,
          disabled: false,
        }),
        workExperiences
      ),
      projects: R.map(
        (projectMembership) => ({
          projectId: projectMembership.project?.id,
          projectName: projectMembership.project?.name,
          companyId: projectMembership.project?.company.id,
          companyName: projectMembership.project?.company.name,
          startYear: projectMembership.startYear,
          startMonth: projectMembership.startMonth,
          endYear: projectMembership.endYear,
          endMonth: projectMembership.endMonth,
          description: projectMembership.description,
          role: projectMembership.role,
          highlight: projectMembership.highlight,
          disabled: false,
        }),
        projectMemberships
      ),
    };
  }

  async mounted(): Promise<void> {
    switch (this.template.exporter) {
      case "pdf":
        await ExportModule.exportPDF({
          ...this.template.data,
          data: this.exportData,
        });
        break;
      case "docx":
        await ExportModule.exportDocx({
          ...this.template.data,
          data: this.exportData,
        });
        break;
      default:
    }
  }
}
</script>