export interface TemplateDto {
  id?: number;

  name: string;

  exporter?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export class Template {
  id!: number;

  name!: string;

  exporter!: string;

  userId!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;

  createdAt!: Date;

  updatedAt!: Date;
}

export class PatchTemplateDtoData {
  name!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;
}

export class PatchTemplateDto {
  id!: number;
  data!: PatchTemplateDtoData;
}

export class CreateTemplateDto {
  name!: string;

  exporter!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data!: any;
}
