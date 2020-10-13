import * as R from "ramda";
import ApiService from "@/services/api/company";
import CompanyModule, { Company } from "@/store/modules/company";
import { CreateCompanyDto, SearchCompanyDto } from "../company";

export default class CompanyService extends ApiService {
  private fakedCompanies: Company[] = [];

  public async deleteCompany(id: number): Promise<void> {
    CompanyModule.delete([id]);
  }

  public async createCompany(
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const id =
      (R.defaultTo(0, R.last(CompanyModule.allIds.sort())) as number) + 1;

    const company = {
      ...createCompanyDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.fakedCompanies.push(company);
    CompanyModule.add([company]);

    return company;
  }

  public async searchCompanies(
    searchCompanyDto: SearchCompanyDto
  ): Promise<Company[]> {
    const companies = await super.searchCompanies(searchCompanyDto);

    return [...companies, ...this.fakedCompanies];
  }
}
