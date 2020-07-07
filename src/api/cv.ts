import Api from "@/api/api";
import { CV } from "@/model";

export class SkillSearch {
  required? = false;

  skillSubjectId!: number;
}

export class SearchCVDto {
  fullName?: string = "";

  limit?: number = 10;

  skills?: SkillSearch[] = [];

  public constructor(init?: Partial<SearchCVDto>) {
    Object.assign(this, init);
  }
}

export const SearchCVs = async (searchCVDto: SearchCVDto): Promise<CV[]> => {
  const cvs = await Api.post("/cv/search", searchCVDto);

  return cvs;
};
