import Api from "@/api/api";
import { Template, TemplateDto } from "@/model";

export const CreateTemplate = async (
  templateDto: TemplateDto
): Promise<Template> => {
  const template = await Api.post("/templates", templateDto);

  return template;
};

export const UpdateTemplate = async (
  templateId: number,
  templateDto: TemplateDto
): Promise<Template> => {
  const template = await Api.put(`/templates/${templateId}`, templateDto);

  return template;
};

export const GetTemplates = async (): Promise<Template[]> => {
  const templates = await Api.get("/templates");

  return templates;
};

export const GetTemplateById = async (
  templateId: number
): Promise<Template> => {
  const template = await Api.get(`/templates/${templateId}`);

  return template;
};

export const DeleteTemplateById = async (templateId: number): Promise<void> => {
  await Api.delete(`/templates/${templateId}`);
};
