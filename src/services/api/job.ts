import Api from "@/api/api";
import JobModule, { Job } from "@/store/modules/job";
import { CreateJobDto, JobSearchResult, SearchJobDto } from "../job";

export default class JobService {
  public async fetchJobs(): Promise<void> {
    await JobModule.setFetching(true);

    const jobs: Job[] = await Api.get("/jobs");
    JobModule.add(jobs);

    await JobModule.setFetching(false);
  }

  public async deleteJob(id: number): Promise<Job> {
    const job = await Api.delete(`/jobs/${id}`);
    JobModule.add([job]);

    return job;
  }

  public async approveJob(id: number): Promise<Job> {
    const job = await Api.post(`/jobs/${id}/approve`, {});
    JobModule.add([job]);
    return job;
  }

  public async rejectJob(id: number): Promise<Job> {
    const job = await Api.post(`/jobs/${id}/reject`, {});
    JobModule.add([job]);
    return job;
  }

  public async createJob(createJobDto: CreateJobDto): Promise<Job> {
    const job: Job = await Api.post("/jobs", createJobDto);
    JobModule.add([job]);

    return job;
  }

  public async searchJobs(
    searchJobDto: SearchJobDto
  ): Promise<JobSearchResult> {
    const result: JobSearchResult = await Api.post(
      "/jobs/search",
      searchJobDto
    );
    JobModule.add(result.items);

    return result;
  }
}
