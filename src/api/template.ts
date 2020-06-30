import Api from "@/api/api";
import Template from "@/store/Template";

export interface CreateTemplateDto {
  name: string;

  exporter: "pdf";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface UpdateTemplateDto {
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface SearchTemplateDto {
  name: string;
  limit?: number;
}

export const CreateTemplate = async (
  createTemplateDto: CreateTemplateDto
): Promise<Template> => {
  const template = await Api.post("/skill_subjects", createTemplateDto);

  Template.insert({
    data: template
  });

  return template;
};

export const UpdateTemplate = async (
  templateId: number,
  updateTemplateDto: UpdateTemplateDto
): Promise<Template> => {
  const template = await Api.put(`/templates/${templateId}`, updateTemplateDto);

  Template.insert({
    data: template
  });

  return template;
};

export const GetTemplates = async (): Promise<Template[]> => {
  const templates = await Api.get("/templates");

  Template.insert({
    data: templates
  });

  return templates;
};

export const GetTemplateById = async (
  templateId: number
): Promise<Template> => {
  const template = await Api.get(`/templates/${templateId}`);

  Template.insert({
    data: template
  });

  return template;
};

export const DeleteTemplateById = async (templateId: number): Promise<void> => {
  await Api.delete(`/templates/${templateId}`);

  Template.delete(templateId);
};
