import Api from "@/api/api";
import { Template, TemplateDto } from "@/store/modules/export";

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
