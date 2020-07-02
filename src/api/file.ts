import Api from "@/api/api";
import StoreFile from "@/store/File";

export interface FileDto {
  file: File;
}

export const CreateFile = async (fileDto: FileDto): Promise<StoreFile> => {
  const formData = new FormData();
  formData.append("file", fileDto.file);
  const file = await Api.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  StoreFile.insert({
    data: file
  });

  return file;
};
