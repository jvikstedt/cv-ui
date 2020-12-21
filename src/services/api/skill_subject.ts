import Api from "@/api/api";
import SkillSubjectModule, {
  SkillSubject,
} from "@/store/modules/skill_subject";
import {
  CreateSkillSubjectDto,
  MergeSkillSubjectsDto,
  PatchSkillSubjectDto,
  SearchSkillSubjectDto,
  SkillSubjectSearchResult,
} from "../skill_subject";

export default class SkillSubjectService {
  public async fetchSkillSubjects(): Promise<void> {
    await SkillSubjectModule.setFetching(true);

    const skillSubjects: SkillSubject[] = await Api.get("/skill_subjects");
    await SkillSubjectModule.saveSkillSubjects(skillSubjects);

    await SkillSubjectModule.setFetching(false);
  }

  public async deleteSkillSubject(id: number): Promise<void> {
    await Api.delete(`/skill_subjects/${id}`);
    SkillSubjectModule.delete([id]);
  }

  public async createSkillSubject(
    createSkillSubjectDto: CreateSkillSubjectDto
  ): Promise<SkillSubject> {
    const skillSubject: SkillSubject = await Api.post(
      "/skill_Subjects",
      createSkillSubjectDto
    );
    await SkillSubjectModule.saveSkillSubjects([skillSubject]);

    return skillSubject;
  }

  public async patchSkillSubject({
    skillSubjectId,
    data,
  }: PatchSkillSubjectDto): Promise<SkillSubject> {
    const skillSubject: SkillSubject = await Api.patch(
      `/skill_subjects/${skillSubjectId}`,
      data
    );
    await SkillSubjectModule.saveSkillSubjects([skillSubject]);

    return skillSubject;
  }

  public async mergeSkillSubjects(
    mergeSkillSubjectsDto: MergeSkillSubjectsDto
  ): Promise<void> {
    await Api.post("/merge/skill_Subjects", mergeSkillSubjectsDto);

    SkillSubjectModule.delete([
      mergeSkillSubjectsDto.sourceId,
      mergeSkillSubjectsDto.targetId,
    ]);
  }

  public async searchSkillSubjects(
    searchSkillSubjectDto: SearchSkillSubjectDto
  ): Promise<SkillSubjectSearchResult> {
    const result: SkillSubjectSearchResult = await Api.post(
      "/skill_Subjects/search",
      searchSkillSubjectDto
    );
    await SkillSubjectModule.saveSkillSubjects(result.items);

    return result;
  }
}
