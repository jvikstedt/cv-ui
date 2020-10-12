import * as R from "ramda";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import ApiService from "@/services/api/skill_group";
import { CreateSkillGroupDto, SearchSkillGroupDto } from "../skill_group";

export default class SkillGroupService extends ApiService {
  private fakedSkillGroups: SkillGroup[] = [];

  public async createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup> {
    const id =
      (R.defaultTo(
        0,
        R.last(Object.keys(SkillGroupModule.byId).sort())
      ) as number) + 1;

    const skillGroup = {
      ...createSkillGroupDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.fakedSkillGroups.push(skillGroup);
    SkillGroupModule.add([skillGroup]);
    return skillGroup;
  }

  public async deleteSkillGroup(id: number): Promise<void> {
    SkillGroupModule.delete([id]);
  }

  public async searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroup[]> {
    const skillSubjects = await super.searchSkillGroups(searchSkillGroupDto);

    return [...skillSubjects, ...this.fakedSkillGroups];
  }
}
