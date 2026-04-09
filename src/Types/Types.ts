export  interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken:string
  tokenType: string
  expiresIn:string
  email: string
  fullName: string
  roles: string[]
}
export  interface InternalLoginPayload {
  email: string
  password: string
}

export interface InternalLoginResponse {
  token: string
  refreshToken: string
  tokenType: string
  expiresIn: string
  email: string
  fullName: string
  roles: string[]
}

export const loginMeta = {
  isInternalLogin: false,
};


export interface SignupPayload {
  firstName: string
  middleName?: string
  lastName:string
  email: string
  password: string
  phone: string
}

export interface SignupResponse {
  token: string
  tokenType: string
  refreshToken: string
  expiresIn: string
  email: string
  firstName: string
  lastName:string
  middleName:string
  roles: string[]
}

export interface JobPostPayload{
   title: string
   description:string
   department:string
   location:string
   employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
   closingDate: string
   status: "PUBLISHED" | "DRAFT" | "CLOSED";
   active:boolean
}

export interface JobApplicationPayload{
    jobPostingId: string,
    email?: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    mobilePhone?: string,
    resumeFile: File,
    declarationAccepted: boolean
}

export interface JobApplicationResponse{
  
    id:string,
    userId: string,
    applicantName: string,
    applicantEmail: string,
    jobPostingId: string,
    jobTitle: string,
    status: "SUBMITTED" | "SCREENED" | "INTERVIEW" | "ASSESSMENT" | "OFFER" | "REJECTED",
    resumeFile: File,
    declarationAccepted: boolean,
    declaredAt: string,
    appliedAt: string,
    updatedAt: string
}



export interface JobPostResponse{
  id: string;
  jobTitle: string;
  jobPurpose:string;
  department: string;
  location: string;
  keyResponsibilities: string;
  kpi:string;
  academicQualificationsAndExperience:string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  closingDate: string;
  applicantType:string;
  status: "PUBLISHED" | "DRAFT" | "CLOSED";
  active: boolean;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmEmailPayload{
  email: string
}

export interface ConfirmEmailResponse{
  message:string
}

export interface ResetPasswordPayload{
  token?:string
  newPassword:string
  confirmPassword:string
}

export interface ResetPasswordResponse{
  message:string
}
