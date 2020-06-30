import axios from "axios";

export class ExportPdfDto {
  content = "";

  scale? = 1;

  displayHeaderFooter? = false;

  headerTemplate? = "";

  footerTemplate? = "";

  printBackground? = false;

  landscape? = false;

  pageRanges? = "";

  format? = "Letter";

  width? = "";

  height? = "";

  marginTop? = "0px";

  marginRight? = "0px";

  marginBottom? = "0px";

  marginLeft? = "0px";

  preferCSSPageSize? = false;
}

const baseURL = process.env.VUE_APP_ENDPOINT;

export const ExportPdf = async (exportPdfDto: ExportPdfDto) => {
  const response = await axios.post(
    `${baseURL}/exporters/pdf/export`,
    exportPdfDto,
    {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
        Authorization: `Bearer ${process.env.VUE_APP_TOKEN}`
      }
    }
  );

  return response.data;
};
