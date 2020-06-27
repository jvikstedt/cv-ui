import Api from "@/api/api";
import CV from "@/store/CV";
import Skill from "@/store/Skill";

export interface PatchCVDto {
  description?: string;
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
