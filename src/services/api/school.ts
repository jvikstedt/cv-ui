import Api from "@/api/api";
import SchoolModule, { School } from "@/store/modules/school";
import { CreateSchoolDto, SearchSchoolDto } from "../school";

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

  public async searchSchools(
    searchSchoolDto: SearchSchoolDto
  ): Promise<School[]> {
    const schools: School[] = await Api.post(
      "/schools/search",
      searchSchoolDto
    );
    SchoolModule.add(schools);

    return schools;
  }
}
