import Api from "@/api/api";
import MergeRequestModule, {
  MergeRequest,
} from "@/store/modules/merge_request";
import {
  CreateMergeRequestDto,
  MergeRequestSearchResult,
  SearchMergeRequestDto,
} from "../merge_request";

export default class MergeRequestService {
  public async fetchMergeRequests(): Promise<void> {
    await MergeRequestModule.setFetching(true);

    const mergeRequests: MergeRequest[] = await Api.get("/merge_requests");
    MergeRequestModule.add(mergeRequests);

    await MergeRequestModule.setFetching(false);
  }

  public async deleteMergeRequest(id: number): Promise<MergeRequest> {
    const mergeRequest = await Api.delete(`/merge_requests/${id}`);
    MergeRequestModule.add([mergeRequest]);

    return mergeRequest;
  }

  public async executeMergeRequest(id: number): Promise<MergeRequest> {
    const mergeRequest = await Api.post(`/merge_requests/${id}/execute`, {});
    MergeRequestModule.add([mergeRequest]);
    return mergeRequest;
  }

  public async rejectMergeRequest(id: number): Promise<MergeRequest> {
    const mergeRequest = await Api.post(`/merge_requests/${id}/reject`, {});
    MergeRequestModule.add([mergeRequest]);
    return mergeRequest;
  }

  public async createMergeRequest(
    createMergeRequestDto: CreateMergeRequestDto
  ): Promise<MergeRequest> {
    const mergeRequest: MergeRequest = await Api.post(
      "/merge_requests",
      createMergeRequestDto
    );
    MergeRequestModule.add([mergeRequest]);

    return mergeRequest;
  }

  public async searchMergeRequests(
    searchMergeRequestDto: SearchMergeRequestDto
  ): Promise<MergeRequestSearchResult> {
    const result: MergeRequestSearchResult = await Api.post(
      "/merge_requests/search",
      searchMergeRequestDto
    );
    MergeRequestModule.add(result.items);

    return result;
  }
}
