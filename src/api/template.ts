import Api from "@/api/api";
import Template from "@/store/Template";

export interface TemplateDto {
  id?: number;

  name: string;

  exporter?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const CreateTemplate = async (
  templateDto: TemplateDto
): Promise<Template> => {
  const template = await Api.post("/templates", templateDto);

  Template.insert({
    data: template
  });

  return template;
};

export const UpdateTemplate = async (
  templateId: number,
  templateDto: TemplateDto
): Promise<Template> => {
  const template = await Api.put(`/templates/${templateId}`, templateDto);

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
