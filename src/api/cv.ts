import Api from "@/api/api";
import CV from "@/store/CV";
import Skill from "@/store/Skill";

export interface PatchCVDto {
  description?: string;
}

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

export const GetCVDetailsById = async (cvId: number): Promise<void> => {
  const cvPromise = Api.get(`/cv/${cvId}`).then((cv: CV) => {
    CV.insert({ data: cv });
  });

  const skillsPromise = Api.get(`/cv/${cvId}/skills`).then(
    (skills: Skill[]) => {
      Skill.insert({
        data: skills
      });
    }
  );

  await Promise.all([cvPromise, skillsPromise]);
};

export const PatchCV = async (
  cvId: number,
  patchCVDto: PatchCVDto
): Promise<CV> => {
  const cv = await Api.patch(`/cv/${cvId}`, patchCVDto);

  CV.insert({
    data: cv
  });

  return cv;
};

export const SearchCVs = async (searchCVDto: SearchCVDto): Promise<CV[]> => {
  const cvs = await Api.post("/cv/search", searchCVDto);

  return cvs;
};
