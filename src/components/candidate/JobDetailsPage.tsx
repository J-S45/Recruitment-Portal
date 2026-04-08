import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { MapPin, Briefcase, Clock, GraduationCap, X } from "lucide-react";
import { useState } from "react";
import type { JobPostResponse } from "@/Types/Types";
import useJobApplication from "@/hooks/useJobApplication";
import { toast } from "sonner";

const formatFullDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(navigator.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface JobDetailsPageProps {
  job: JobPostResponse;
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    "& fieldset": { borderColor: "#d1d5db" },
    "&:hover fieldset": { borderColor: "#f59e0b" },
    "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#f59e0b" },
  "& .MuiInputBase-input": { color: "#111827", fontWeight: 500 },
};

const readOnlySx = {
  ...textFieldSx,
  "& .MuiOutlinedInput-root": {
    ...textFieldSx["& .MuiOutlinedInput-root"],
    background: "#f9fafb",
    cursor: "not-allowed",
  },
};

function JobDetailsPage({ job }: JobDetailsPageProps) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const signUpDetails = JSON.parse(sessionStorage.getItem("signupDetails") || "{}");

  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [declaration, setDeclaration] = useState(false);

  const { mutate: jobApplication, isPending } = useJobApplication(() => setOpen(false));

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setResume(null);
    setDeclaration(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please upload your resume.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      
      return;
    }

    jobApplication({
      jobPostingId: job.id,
      firstName: signUpDetails?.firstName?.trim() ?? "",
      middleName: signUpDetails?.middleName?.trim() ?? "",
      lastName: signUpDetails?.lastName?.trim() ?? "",
      mobilePhone: signUpDetails?.phone?.trim() ?? "",
      email: loggedInUser?.email?.trim() ?? "",
      resumeFile: resume,
      declarationAccepted: declaration,
    });
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        sx={{
          backgroundColor: "#f59e0b",
          color: "#000",
          fontWeight: 600,
          fontFamily: "'Kuro', sans-serif",
          borderRadius: "8px",
          padding: "10px 24px",
          textTransform: "none",
          "&:hover": { backgroundColor: "#d97706" },
        }}
      >
        Apply Now
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          
          className: "w-[95vw] sm:w-[90vw] max-w-[1100px] h-[95vh] sm:h-[90vh] rounded-2xl overflow-hidden",
        }}
      >
        <DialogContent className="p-0 h-full overflow-hidden">
         
          <div className="flex flex-col md:flex-row h-full">

            
            <div className="w-full md:w-[45%] bg-[#222d32] flex flex-col p-5 sm:p-8 overflow-y-auto max-h-[40vh] md:max-h-full">
              <button
                onClick={handleClose}
                className="self-end text-gray-400 hover:text-white transition-colors mb-4"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 sm:mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Now Hiring
                </span>
                <h1 className="text-xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                  {job.jobTitle}
                </h1>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-amber-400">{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full font-medium">
                    {job.employmentType.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">
                    Closes: {formatFullDate(job.closingDate)}
                  </span>
                </div>
              </div>

              
              <div className="border-t border-white/10 mb-4 hidden sm:block" />
              <div className="mb-4 hidden sm:block">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
                    Job Description
                  </h2>
                </div>
                 <h4 className="text-base font-bold uppercase tracking-widest text-amber-400">
                    About Job
                  </h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.jobPurpose}
                </p>
                 <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">
                    Job Responsibilities
                  </h4>
                 <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.keyResponsibilities}
                </p>
                 <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">
                    Academic Qualifications And Experience
                  </h4>
                 <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.academicQualificationsAndExperience}
                </p>
                </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
                    Posted By
                  </h2>
                </div>
                <p className="text-gray-300 text-sm">{job.createdByName}</p>
              </div>
            </div>

            
            <div className="w-full md:w-[55%] flex flex-col bg-white overflow-y-auto flex-1">
              <div className="bg-amber-400 py-4 sm:py-6 px-6 sm:px-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-black/60 mb-1">
                  Applying for
                </p>
                <h2 className="text-base sm:text-xl font-bold text-black">{job.jobTitle}</h2>
              </div>

              <div className="p-5 sm:p-8 flex flex-col gap-4 sm:gap-5 flex-1">
                <form
                  id="job-application-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 sm:gap-5"
                >
                  <TextField
                    required name="firstName" label="First Name" type="text"
                    fullWidth variant="outlined" size="small" sx={readOnlySx}
                    defaultValue={signUpDetails?.firstName}
                    // InputProps={{ readOnly: true }}
                  />
                  <TextField
                    required name="middleName" label="Middle Name" type="text"
                    fullWidth variant="outlined" size="small" sx={readOnlySx}
                    defaultValue={signUpDetails?.middleName}
                    // InputProps={{ readOnly: true }}
                  />
                  <TextField
                    required name="lastName" label="Last Name" type="text"
                    fullWidth variant="outlined" size="small" sx={readOnlySx}
                    defaultValue={signUpDetails?.lastName}
                    // InputProps={{ readOnly: true }}
                  />
                  {loggedInUser?.roles?.[0] === "External Applicant" && (
                    <TextField
                      required name="phone" label="Phone Number" type="tel"
                      fullWidth variant="outlined" size="small" sx={readOnlySx}
                      defaultValue={signUpDetails?.phone}
                      // InputProps={{ readOnly: true }}
                    />
                  )}
                  {loggedInUser?.roles?.[0] === "External Applicant" && (
                    <TextField
                      required name="email" label="Email Address" type="email"
                      fullWidth variant="outlined" size="small" sx={readOnlySx}
                      defaultValue={loggedInUser?.email}
                      // InputProps={{ readOnly: true }}
                    />
                  )}

                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-600 font-medium">
                      Upload Resume <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer
                        file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0
                        file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700
                        hover:file:bg-amber-200 transition-colors w-full"
                    />
                    <span className="text-xs text-gray-400">Accepted formats: PDF, DOC, DOCX</span>
                  </div>

                  
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="declaration"
                      checked={declaration}
                      onChange={(e) => setDeclaration(e.target.checked)}
                      className="mt-0.5 cursor-pointer accent-amber-400 flex-shrink-0"
                      required
                    />
                    <label htmlFor="declaration" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                      I declare that all information provided in this application is true and accurate to the best of my knowledge.
                    </label>
                  </div>

                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="job-application-form"
                      disabled={isPending || !declaration}
                      className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default JobDetailsPage;