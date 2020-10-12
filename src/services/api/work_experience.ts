import Api from "@/api/api";
import WorkExperienceModule, {
  WorkExperience,
} from "@/store/modules/work_experience";
import {
  CreateWorkExperienceDto,
  DeleteWorkExperienceDto,
  PatchWorkExperienceDto,
} from "../work_experience";

export default class WorkExperienceService {
  public async fetchCVWorkExperiences(cvId: number): Promise<void> {
    await WorkExperienceModule.setFetching(true);
    const workExperiences: WorkExperience[] = await Api.get(
      `/cv/${cvId}/work_experience`
    );

    WorkExperienceModule.resetCV(cvId);
    await WorkExperienceModule.saveWorkExperiences(workExperiences);
    await WorkExperienceModule.setFetching(false);
  }

  public async patchWorkExperience({
    cvId,
    workExperienceId,
    data,
  }: PatchWorkExperienceDto): Promise<void> {
    const workExperience: WorkExperience = await Api.patch(
      `/cv/${cvId}/work_experience/${workExperienceId}`,
      data
    );

    await WorkExperienceModule.saveWorkExperiences([workExperience]);
  }

  public async deleteWorkExperience(
    deleteWorkExperienceDto: DeleteWorkExperienceDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteWorkExperienceDto.cvId}/work_experience/${deleteWorkExperienceDto.workExperienceId}`
    );
    WorkExperienceModule.delete([deleteWorkExperienceDto.workExperienceId]);
  }

  public async createWorkExperience(
    createWorkExperienceDto: CreateWorkExperienceDto
  ): Promise<WorkExperience> {
    const workExperience: WorkExperience = await Api.post(
      `/cv/${createWorkExperienceDto.cvId}/work_experience`,
      createWorkExperienceDto
    );
    await WorkExperienceModule.saveWorkExperiences([workExperience]);

    return workExperience;
  }
}
