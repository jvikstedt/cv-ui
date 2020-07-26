export class ExportData {
  user!: ExportDataUser;
  skills!: ExportDataSkill[];
  educations!: ExportDataEducation[];
  jobs!: ExportDataJob[];
  projects!: ExportDataProject[];
}

export class ExportDataUser {
  cvId!: number;
  description!: string;
  updatedAt!: string;
  userId!: number;
  username!: string;
  avatarId!: number;
  firstName!: string;
  lastName!: string;
  jobTitle!: string;
  phone!: string;
  location!: string;
  workExperienceInYears!: number;
  email!: string;
}

export class ExportDataSkill {
  id!: number;
  experienceInYears!: number;
  skillSubjectId!: number;
  name!: string;
  skillGroupId!: number;
  skillGroupName!: string;
  highlight!: boolean;
  disabled!: boolean;
}

export class ExportDataEducation {
  schoolId!: number;
  schoolName!: string;
  startYear!: number;
  endYear!: number;
  degree!: string;
  fieldOfStudy!: string;
  description!: string;
  highlight!: boolean;
  disabled!: boolean;
}

export class ExportDataJob {
  companyId!: number;
  companyName!: string;
  startYear!: number;
  startMonth!: number;
  endYear!: number;
  endMonth!: number;
  description!: string;
  jobTitle!: string;
  disabled!: boolean;
}

export class ExportDataProject {
  projectId!: number;
  projectName!: string;
  companyId!: number;
  companyName!: string;
  startYear!: number;
  startMonth!: number;
  endYear!: number;
  endMonth!: number;
  description!: string;
  highlight!: boolean;
  disabled!: boolean;
}
