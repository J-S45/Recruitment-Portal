import { LogOut} from "lucide-react";
import { FcAnswers, FcBriefcase, FcBullish, FcCalendar } from "react-icons/fc";

export interface SidebarItem {
    id: string;
    title: string;
    icon:React.ElementType;
}
export interface User {
  id: number;
  fullname: string;
  email: string;
  password: string;
  role: string;
}
export interface Job_Application{
    id: number;
    title:string;
    Emoji: string;
    Category: string;
    Employment_Type: string;
    location: string;
    Description: string;
    Experience:string;
}

export interface Document {
  id: number;
  name: string;
 }

const REQUIRED_DOCUMENTS:Document[] = [
  { id: 1, name: "Signed Contracts" },
  { id: 2, name: "Passport Pictures" },
  { id: 3, name: "Valid National ID" },
  { id: 4, name: "Current CV" },
  { id: 5, name: "Educational Certificates" },
  { id: 6, name: "National Service Certificate" },
  { id: 7, name: "Birth Certificate for Employee" },
  { id: 8, name: "Birth Certificates for Children" },
  { id: 9, name: "Marriage Certificate" },
  { id: 10, name: "SSNIT Number" },
  { id: 11, name: "Ghana Card Number" },
  { id: 12, name: "Police Report" },
  { id: 13, name: "Affidavit/Gazette" },
];


const JOB_CATEGORY = [
    {
     value:"Management Information Systems",
     title:"Management Information Systems"
    },
     {
     value:"Risk",
     title:"Risk"
    },
     {
     value:"Credit",
     title:"Credit"
    },
     {
     value:"Legal",
     title:"Legal"
    },
     {
     value:"Banking Operations",
     title:"Banking Operations"
    },
     {
     value:"People and Culture",
     title:"People and Culture"
    },
    {
     value:"Finance",
     title:"Finance"
    },
    {
     value:"Marketing",
     title:"Marketing"
    },
    {
     value:"Automation and Development",
     title:"Automation and Development"
    },
   
]






     

const SIDEBAR_CONSTANTS_GUEST:SidebarItem[] = [
     {
        id:"/home",
        title:"Dashboard",
        icon: FcBullish
    },
    {
        id:"/home/jobs",
        title:"Jobs",
        icon: FcBriefcase
    },
    {
        id:"/home/interview-schedule",
        title:"Schedule",
        icon: FcCalendar
    },
    {

        id:"/home/documents-upload",
        title:"Documents Upload",
        icon: FcAnswers
    }
];

const SIDEBAR_CONSTANTS_LOGOUT:SidebarItem[] = [
    {
      id:"/login",
        title: "Logout",
        icon:LogOut
    }
];

export {
    REQUIRED_DOCUMENTS,
    SIDEBAR_CONSTANTS_GUEST,
    SIDEBAR_CONSTANTS_LOGOUT,
    JOB_CATEGORY
}