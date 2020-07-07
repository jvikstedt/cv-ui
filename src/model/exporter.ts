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
