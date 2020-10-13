import * as R from "ramda";
import ApiService from "@/services/api/school";
import SchoolModule, { School } from "@/store/modules/school";
import { CreateSchoolDto, SearchSchoolDto } from "../school";

export default class SchoolService extends ApiService {
  private fakedSchools: School[] = [];

  public async deleteSchool(id: number): Promise<void> {
    SchoolModule.delete([id]);
  }

  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const id =
      (R.defaultTo(0, R.last(SchoolModule.allIds.sort())) as number) + 1;

    const school = {
      ...createSchoolDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.fakedSchools.push(school);
    SchoolModule.add([school]);

    return school;
  }

  public async searchSchools(
    searchSchoolDto: SearchSchoolDto
  ): Promise<School[]> {
    const schools = await super.searchSchools(searchSchoolDto);

    return [...schools, ...this.fakedSchools];
  }
}
