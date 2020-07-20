export class ExportData {
  user!: ExportDataUser;
  skills!: ExportDataSkill[];
  educations!: ExportDataEducation[];
  workExperiences!: ExportDataWorkExperience[];
  projectMemberships!: ExportDataProjectMembership[];
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
  email!: string;
}

export class ExportDataSkill {
  id!: number;
  experienceInYears!: number;
  skillSubjectId!: number;
  name!: string;
  skillGroupId!: number;
  skillGroupName!: string;
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
}

export class ExportDataWorkExperience {
  companyId!: number;
  companyName!: string;
  startYear!: number;
  startMonth!: number;
  endYear!: number;
  endMonth!: number;
  description!: string;
  jobTitle!: string;
}

export class ExportDataProjectMembership {
  projectId!: number;
  projectName!: string;
  companyId!: number;
  companyName!: string;
  startYear!: number;
  startMonth!: number;
  endYear!: number;
  endMonth!: number;
  description!: string;
}
