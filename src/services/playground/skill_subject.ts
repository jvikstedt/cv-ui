import * as R from "ramda";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import ApiService from "@/services/api/skill_subject";
import {
  CreateSkillSubjectDto,
  PatchSkillSubjectDto,
  SearchSkillSubjectDto,
  SkillSubjectSearchResult,
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
  }: PatchSkillSubjectDto): Promise<SkillSubject> {
    const originalSkillSubject = SkillSubjectModule.find(skillSubjectId);
    if (!originalSkillSubject) {
      throw new Error(`Could not find skill subject ${skillSubjectId}`);
    }
    const skillSubject = {
      ...originalSkillSubject,
      ...data,
    };

    await SkillSubjectModule.saveSkillSubjects([skillSubject]);
    return skillSubject;
  }

  public async searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubjectSearchResult> {
    const result = await super.searchSkillSubjects(searchSkillSubjectDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedSkillSubjects],
      total: total + R.length(this.fakedSkillSubjects),
    };
  }
}
