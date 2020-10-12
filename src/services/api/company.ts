import Api from "@/api/api";
import CompanyModule, { Company } from "@/store/modules/company";
import { CreateCompanyDto, SearchCompanyDto } from "../company";

export default class CompanyService {
  public async fetchCompanies(): Promise<void> {
    await CompanyModule.setFetching(true);

    const companies: Company[] = await Api.get("/company");
    CompanyModule.add(companies);

    await CompanyModule.setFetching(false);
  }

  public async deleteCompany(id: number): Promise<void> {
    await Api.delete(`/company/${id}`);
    CompanyModule.delete([id]);
  }

  public async createCompany(
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const company: Company = await Api.post("/company", createCompanyDto);
    CompanyModule.add([company]);

    return company;
  }

  public async searchCompanies(
    searchCompanyDto: SearchCompanyDto
  ): Promise<Company[]> {
    const companies: Company[] = await Api.post(
      "/company/search",
      searchCompanyDto
    );
    CompanyModule.add(companies);

    return companies;
  }
}
