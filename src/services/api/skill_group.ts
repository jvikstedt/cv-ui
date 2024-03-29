import Api from "@/api/api";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import {
  CreateSkillGroupDto,
  PatchSkillGroupDto,
  SearchSkillGroupDto,
  SkillGroupSearchResult,
} from "../skill_group";

export default class SkillGroupService {
  public async fetchSkillGroups(): Promise<void> {
    await SkillGroupModule.setFetching(true);

    const skillGroups: SkillGroup[] = await Api.get("/skill_groups");
    SkillGroupModule.add(skillGroups);

    await SkillGroupModule.setFetching(false);
  }

  public async deleteSkillGroup(id: number): Promise<void> {
    await Api.delete(`/skill_groups/${id}`);
    SkillGroupModule.delete([id]);
  }

  public async createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup> {
    const skillGroup: SkillGroup = await Api.post(
      "/skill_groups",
      createSkillGroupDto
    );
    SkillGroupModule.add([skillGroup]);

    return skillGroup;
  }

  public async patchSkillGroup({
    skillGroupId,
    data,
  }: PatchSkillGroupDto): Promise<SkillGroup> {
    const skillGroup: SkillGroup = await Api.patch(
      `/skill_groups/${skillGroupId}`,
      data
    );
    SkillGroupModule.add([skillGroup]);

    return skillGroup;
  }

  public async searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroupSearchResult> {
    const result: SkillGroupSearchResult = await Api.post(
      "/skill_groups/search",
      searchSkillGroupDto
    );
    SkillGroupModule.add(result.items);

    return result;
  }
}
