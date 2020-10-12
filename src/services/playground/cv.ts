import CVModule from "@/store/modules/cv";
import ApiService from "@/services/api/cv";
import { PatchCVDto } from "../cv";

export default class CVService extends ApiService {
  public async patchCV({ id, data }: PatchCVDto): Promise<void> {
    const originalCV = CVModule.find(id);
    if (!originalCV) {
      return;
    }
    const cv = {
      ...originalCV,
      ...data,
    };

    await CVModule.saveCVs([cv]);
  }
}
