import { MergeRequest } from "@/store/modules/merge_request";
import ApiService from "./api/merge_request";

export const Api = new ApiService();

export interface CreateMergeRequestDto {
  entity: string;
  description: string;
  sourceId: number;
  targetId: number;
}

export interface SearchMergeRequestDto {
  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface MergeRequestSearchResult {
  items: MergeRequest[];
  total: number;
}

export interface Service {
  fetchMergeRequests(): Promise<void>;
  deleteMergeRequest(id: number): Promise<MergeRequest>;
  executeMergeRequest(id: number): Promise<MergeRequest>;
  rejectMergeRequest(id: number): Promise<MergeRequest>;
  createMergeRequest(
    createMergeRequestDto: CreateMergeRequestDto
  ): Promise<MergeRequest>;
  searchMergeRequests(
    searchMergeRequestDto: SearchMergeRequestDto
  ): Promise<MergeRequestSearchResult>;
}
