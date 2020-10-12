import Api from "@/api/api";
import CVModule, { CV } from "@/store/modules/cv";
import { PatchCVDto } from "../cv";

export default class CVService {
  public async fetchCV(id: number): Promise<void> {
    await CVModule.setFetching(true);

    const cv = await Api.get(`/cv/${id}`);

    CVModule.delete([id]);
    await CVModule.saveCVs([cv]);
    await CVModule.setFetching(false);
  }

  public async patchCV({ id, data }: PatchCVDto): Promise<void> {
    const cv: CV = await Api.patch(`/cv/${id}`, data);
    await CVModule.saveCVs([cv]);
  }
}
