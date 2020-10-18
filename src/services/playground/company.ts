import * as R from "ramda";
import ApiService from "@/services/api/company";
import CompanyModule, { Company } from "@/store/modules/company";
import {
  CompanySearchResult,
  CreateCompanyDto,
  PatchCompanyDto,
  SearchCompanyDto,
} from "../company";
import { SortArrayOfNumbers } from "@/helpers/index";

export default class CompanyService extends ApiService {
  private fakedCompanies: Company[] = [];

  public async deleteCompany(id: number): Promise<void> {
    CompanyModule.delete([id]);
  }

  public async createCompany(
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const id =
      (R.defaultTo(
        0,
        R.last(SortArrayOfNumbers(CompanyModule.allIds))
      ) as number) + 1;

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

  public async patchCompany({
    companyId,
    data,
  }: PatchCompanyDto): Promise<Company> {
    const originalCompany = CompanyModule.find(companyId);
    if (!originalCompany) {
      throw new Error(`Could not find company ${companyId}`);
    }
    const company = {
      ...originalCompany,
      ...data,
    };

    CompanyModule.add([company]);
    return company;
  }

  public async searchCompanies(
    searchCompanyDto: SearchCompanyDto
  ): Promise<CompanySearchResult> {
    const result = await super.searchCompanies(searchCompanyDto);

    const { items, total } = result;

    return {
      items: [...items, ...this.fakedCompanies],
      total: total + R.length(this.fakedCompanies),
    };
  }
}
