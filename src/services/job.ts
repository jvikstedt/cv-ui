import { Job } from "@/store/modules/job";
import ApiService from "./api/job";

export const Api = new ApiService();

export interface CreateJobDto {
  runner: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface SearchJobDto {
  take?: number;

  skip?: number;

  orderColumnName?: string;

  orderSort?: "ASC" | "DESC";
}

export interface JobSearchResult {
  items: Job[];
  total: number;
}

export interface Service {
  fetchJobs(): Promise<void>;
  deleteJob(id: number): Promise<Job>;
  approveJob(id: number): Promise<Job>;
  rejectJob(id: number): Promise<Job>;
  createJob(createJobDto: CreateJobDto): Promise<Job>;
  searchJobs(searchJobDto: SearchJobDto): Promise<JobSearchResult>;
}
