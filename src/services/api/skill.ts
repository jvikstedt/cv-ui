import Api from "@/api/api";
import SkillModule, { Skill } from "@/store/modules/skill";
import { CreateSkillDto, DeleteSkillDto, PatchSkillDto } from "../skill";

export default class SkillService {
  public async fetchCVSkills(cvId: number): Promise<void> {
    await SkillModule.setFetching(true);
    const skills: Skill[] = await Api.get(`/cv/${cvId}/skills`);

    SkillModule.resetCV(cvId);
    await SkillModule.saveSkills(skills);
    await SkillModule.setFetching(false);
  }

  public async createSkill(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill: Skill = await Api.post(
      `/cv/${createSkillDto.cvId}/skills`,
      createSkillDto
    );
    await SkillModule.saveSkills([skill]);
    return skill;
  }

  public async deleteSkill(deleteSkillDto: DeleteSkillDto): Promise<void> {
    await Api.delete(
      `/cv/${deleteSkillDto.cvId}/skills/${deleteSkillDto.skillId}`
    );
    SkillModule.delete([deleteSkillDto.skillId]);
  }

  public async patchSkill({
    cvId,
    skillId,
    data,
  }: PatchSkillDto): Promise<void> {
    const skill: Skill = await Api.patch(`/cv/${cvId}/skills/${skillId}`, data);

    await SkillModule.saveSkills([skill]);
  }
}
