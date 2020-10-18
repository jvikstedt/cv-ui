import Api from "@/api/api";
import SchoolModule, { School } from "@/store/modules/school";
import {
  CreateSchoolDto,
  PatchSchoolDto,
  SchoolSearchResult,
  SearchSchoolDto,
} from "../school";

export default class SchoolService {
  public async fetchSchools(): Promise<void> {
    await SchoolModule.setFetching(true);

    const schools: School[] = await Api.get("/schools");
    SchoolModule.add(schools);

    await SchoolModule.setFetching(false);
  }

  public async deleteSchool(id: number): Promise<void> {
    await Api.delete(`/schools/${id}`);
    SchoolModule.delete([id]);
  }

  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school: School = await Api.post("/schools", createSchoolDto);
    SchoolModule.add([school]);

    return school;
  }

  public async patchSchool({
    schoolId,
    data,
  }: PatchSchoolDto): Promise<School> {
    const school: School = await Api.patch(`/schools/${schoolId}`, data);
    SchoolModule.add([school]);

    return school;
  }

  public async searchSchools(
    searchSchoolDto: SearchSchoolDto
  ): Promise<SchoolSearchResult> {
    const result: SchoolSearchResult = await Api.post(
      "/schools/search",
      searchSchoolDto
    );
    SchoolModule.add(result.items);

    return result;
  }
}
