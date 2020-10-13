import * as R from "ramda";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import ApiService from "@/services/api/skill_subject";
import {
  CreateSkillSubjectDto,
  PatchSkillSubjectDto,
  SearchSkillSubjectDto,
} from "../skill_subject";
import SkillGroupModule from "@/store/modules/skill_group";

export default class SkillSubjectService extends ApiService {
  private fakedSkillSubjects: SkillSubject[] = [];

  public async createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject> {
    const id =
      (R.defaultTo(0, R.last(SkillSubjectModule.allIds.sort())) as number) + 1;

    const skillSubject = {
      ...createSkillSubjectDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      skillGroup: SkillGroupModule.find(createSkillSubjectDto.skillGroupId)!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fakedSkillSubjects.push(skillSubject);
    await SkillSubjectModule.saveSkillSubjects([skillSubject]);
    return skillSubject;
  }

  public async deleteSkillSubject(id: number): Promise<void> {
    SkillSubjectModule.delete([id]);
  }

  public async patchSkillSubject({
    skillSubjectId,
    data,
  }: PatchSkillSubjectDto): Promise<void> {
    const originalSkillSubject = SkillSubjectModule.find(skillSubjectId);
    if (!originalSkillSubject) {
      return;
    }
    const skillSubject = {
      ...originalSkillSubject,
      ...data,
    };

    await SkillSubjectModule.saveSkillSubjects([skillSubject]);
  }

  public async searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubject[]> {
    const skillSubjects = await super.searchSkillSubjects(
      searchSkillSubjectDto
    );

    return [...skillSubjects, ...this.fakedSkillSubjects];
  }
}
