import * as R from "ramda";
import SkillModule, { Skill } from "@/store/modules/skill";
import SkillSubjectModule from "@/store/modules/skill_subject";
import ApiService from "@/services/api/skill";
import { CreateSkillDto, DeleteSkillDto, PatchSkillDto } from "../skill";

export default class SkillService extends ApiService {
  public async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const id =
      (R.defaultTo(0, R.last(Object.keys(SkillModule.byId).sort())) as number) +
      1;

    const skill = {
      ...createSkillDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      skillSubject: SkillSubjectModule.find(createSkillDto.skillSubjectId)!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await SkillModule.saveSkills([skill]);
    return skill;
  }

  public async deleteSkill(deleteSkillDto: DeleteSkillDto): Promise<void> {
    SkillModule.delete([deleteSkillDto.skillId]);
  }

  public async patchSkill({ skillId, data }: PatchSkillDto): Promise<void> {
    const originalSkill = SkillModule.find(skillId);
    if (!originalSkill) {
      return;
    }
    const skill = {
      ...originalSkill,
      ...data,
    };

    await SkillModule.saveSkills([skill]);
  }

  public findPlaygroundSkill(
    cvId: number,
    skillSubjectId: number,
    data: Record<string, unknown> = {}
  ): Skill {
    let skill = SkillModule.findBySkillSubject(cvId, skillSubjectId);
    if (!skill) {
      const id =
        (R.defaultTo(
          0,
          R.last(Object.keys(SkillModule.byId).sort())
        ) as number) + 1;
      const skillSubject = SkillSubjectModule.find(skillSubjectId);
      skill = {
        id,
        cvId,
        experienceInYears: 0,
        interestLevel: 2,
        highlight: false,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        skillSubject: skillSubject!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        skillSubjectId: skillSubject!.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
    }
    return skill;
  }
}
