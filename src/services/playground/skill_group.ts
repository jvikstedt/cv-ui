import * as R from "ramda";
import SkillGroupModule, { SkillGroup } from "@/store/modules/skill_group";
import ApiService from "@/services/api/skill_group";
import {
  CreateSkillGroupDto,
  PatchSkillGroupDto,
  SearchSkillGroupDto,
  SkillGroupSearchResult,
} from "../skill_group";
import { SortArrayOfNumbers } from "@/helpers/index";

export default class SkillGroupService extends ApiService {
  private fakedSkillGroups: SkillGroup[] = [];

  public async createSkillGroup(
    createSkillGroupDto: CreateSkillGroupDto
  ): Promise<SkillGroup> {
    const id =
      (R.defaultTo(
        0,
        R.last(SortArrayOfNumbers(SkillGroupModule.allIds))
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

  public async patchSkillGroup({
    skillGroupId,
    data,
  }: PatchSkillGroupDto): Promise<SkillGroup> {
    const originalSkillGroup = SkillGroupModule.find(skillGroupId);
    if (!originalSkillGroup) {
      throw new Error(`Could not find skillGroup ${skillGroupId}`);
    }
    const skillGroup = {
      ...originalSkillGroup,
      ...data,
    };

    SkillGroupModule.add([skillGroup]);
    return skillGroup;
  }

  public async searchSkillGroups(
    searchSkillGroupDto: SearchSkillGroupDto
  ): Promise<SkillGroupSearchResult> {
    const result = await super.searchSkillGroups(searchSkillGroupDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedSkillGroups],
      total: total + R.length(this.fakedSkillGroups),
    };
  }
}
