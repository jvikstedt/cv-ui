import * as R from "ramda";
import EducationModule, { Education } from "@/store/modules/education";
import SchoolModule from "@/store/modules/school";
import ApiService from "@/services/api/education";
import {
  CreateEducationDto,
  DeleteEducationDto,
  PatchEducationDto,
} from "../education";

export default class EducationService extends ApiService {
  public async createEducation(
    createEducationDto: CreateEducationDto
  ): Promise<Education> {
    const id =
      (R.defaultTo(
        0,
        R.last(Object.keys(EducationModule.byId).sort())
      ) as number) + 1;

    const education = {
      ...createEducationDto,
      id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      school: SchoolModule.find(createEducationDto.schoolId)!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await EducationModule.saveEducations([education]);
    return education;
  }

  public async deleteEducation(
    deleteEducationDto: DeleteEducationDto
  ): Promise<void> {
    EducationModule.delete([deleteEducationDto.educationId]);
  }

  public async patchEducation({
    educationId,
    data,
  }: PatchEducationDto): Promise<void> {
    const originalEducation = EducationModule.find(educationId);
    if (!originalEducation) {
      return;
    }
    const education = {
      ...originalEducation,
      ...data,
    };

    await EducationModule.saveEducations([education]);
  }
}
