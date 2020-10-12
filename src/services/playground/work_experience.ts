import * as R from "ramda";
import WorkExperienceModule, {
  WorkExperience,
} from "@/store/modules/work_experience";
import CompanyModule from "@/store/modules/company";
import ApiService from "@/services/api/work_experience";
import {
  CreateWorkExperienceDto,
  DeleteWorkExperienceDto,
  PatchWorkExperienceDto,
} from "../work_experience";

export default class WorkExperienceService extends ApiService {
  public async createWorkExperience(
    createWorkExperienceDto: CreateWorkExperienceDto
  ): Promise<WorkExperience> {
    const id =
      (R.defaultTo(
        0,
        R.last(Object.keys(WorkExperienceModule.byId).sort())
      ) as number) + 1;

    const workExperience = {
      ...createWorkExperienceDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      company: CompanyModule.find(createWorkExperienceDto.companyId)!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await WorkExperienceModule.saveWorkExperiences([workExperience]);
    return workExperience;
  }

  public async deleteWorkExperience(
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ): Promise<void> {
    WorkExperienceModule.delete([deleteWorkExperienceDto.workExperienceId]);
  }

  public async patchWorkExperience({
    workExperienceId,
    data,
  }: PatchWorkExperienceDto): Promise<void> {
    const originalWorkExperience = WorkExperienceModule.find(workExperienceId);
    if (!originalWorkExperience) {
      return;
    }
    const workExperience = {
      ...originalWorkExperience,
      ...data,
    };

    await WorkExperienceModule.saveWorkExperiences([workExperience]);
  }
}
