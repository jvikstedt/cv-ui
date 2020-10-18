import * as R from "ramda";
import ApiService from "@/services/api/school";
import SchoolModule, { School } from "@/store/modules/school";
import {
  CreateSchoolDto,
  PatchSchoolDto,
  SchoolSearchResult,
  SearchSchoolDto,
} from "../school";
import { SortArrayOfNumbers } from "@/helpers/index";

export default class SchoolService extends ApiService {
  private fakedSchools: School[] = [];

  public async deleteSchool(id: number): Promise<void> {
    SchoolModule.delete([id]);
  }

  public async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const id =
      (R.defaultTo(
        0,
        R.last(SortArrayOfNumbers(SchoolModule.allIds))
      ) as number) + 1;

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

  public async patchSchool({
    schoolId,
    data,
  }: PatchSchoolDto): Promise<School> {
    const originalSchool = SchoolModule.find(schoolId);
    if (!originalSchool) {
      throw new Error(`Could not find school ${schoolId}`);
    }
    const school = {
      ...originalSchool,
      ...data,
    };

    SchoolModule.add([school]);
    return school;
  }

  public async searchSchools(
    searchSchoolDto: SearchSchoolDto
  ): Promise<SchoolSearchResult> {
    const result = await super.searchSchools(searchSchoolDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedSchools],
      total: total + R.length(this.fakedSchools),
    };
  }
}
