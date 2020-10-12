import Api from "@/api/api";
import EducationModule, { Education } from "@/store/modules/education";
import {
  CreateEducationDto,
  DeleteEducationDto,
  PatchEducationDto,
} from "../education";

export default class EducationService {
  public async fetchCVEducations(cvId: number): Promise<void> {
    await EducationModule.setFetching(true);
    const educations: Education[] = await Api.get(`/cv/${cvId}/educations`);

    EducationModule.resetCV(cvId);
    await EducationModule.saveEducations(educations);
    await EducationModule.setFetching(false);
  }

  public async patchEducation({
    cvId,
    educationId,
    data,
  }: PatchEducationDto): Promise<void> {
    const education: Education = await Api.patch(
      `/cv/${cvId}/educations/${educationId}`,
      data
    );

    await EducationModule.saveEducations([education]);
  }

  public async deleteEducation(
    deleteEducationDto: DeleteEducationDto
  ): Promise<void> {
    await Api.delete(
      `/cv/${deleteEducationDto.cvId}/educations/${deleteEducationDto.educationId}`
    );
    EducationModule.delete([deleteEducationDto.educationId]);
  }

  public async createEducation(
    createEducationDto: CreateEducationDto
  ): Promise<Education> {
    const education: Education = await Api.post(
      `/cv/${createEducationDto.cvId}/educations`,
      createEducationDto
    );
    await EducationModule.saveEducations([education]);

    return education;
  }
}
