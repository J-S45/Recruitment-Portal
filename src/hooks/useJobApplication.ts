import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APIClient from "src/services/api-clients";
import type { JobApplicationPayload, JobApplicationResponse } from "@/Types/Types";
import { useNavigate } from "react-router-dom";

const useJobApplication = (onAdd?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<JobApplicationResponse, Error, JobApplicationPayload>({
    mutationKey: ["JobApplication"],
    mutationFn: async (data) => {

      
      const apiClient = new APIClient<FormData, JobApplicationResponse>(
       `/api/v1/applications/external?jobPostingId=${data.jobPostingId}&email=${data.email}&firstName=${data.firstName}&middleName=${data.middleName}&lastName=${data.lastName}&mobilePhone=${data.mobilePhone}&declarationAccepted=${data.declarationAccepted}`
      );

      const formData = new FormData();

    //   formData.append("application", new Blob([JSON.stringify({
    //    })], { type: "application/json" }));

      if (data.resumeFile) {
        formData.append("resumeFile", data.resumeFile);
      }

      return apiClient.postMultipart(formData);
    },

    onSuccess: () => {
      toast.success("Application submitted successfully", {
        position: "top-right",
        style: { color: "#237227" },
      });
      console.log("Application submitted successfully:");
      queryClient.invalidateQueries({ queryKey: ["AppliedJobs"] });
      if (onAdd) onAdd();
      navigate("/home");
    },

    onError: (error) => {
      toast.error(error?.message || "Application failed", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      console.error("❌ Application failed:", error.message);
    },
  });
};

export default useJobApplication;