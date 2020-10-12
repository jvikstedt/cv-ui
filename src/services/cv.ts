import PlaygroundService from "./playground/cv";
import ApiService from "./api/cv";

export const Playground = new PlaygroundService();
export const Api = new ApiService();

export interface PatchCVDtoData {
  description: string;
}

export interface PatchCVDto {
  id: number;
  data: PatchCVDtoData;
}

export interface Service {
  patchCV(patchCVDto: PatchCVDto): Promise<void>;
  fetchCV(cvId: number): Promise<void>;
}
