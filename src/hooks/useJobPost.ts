import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APIClient from "src/services/api-clients";
import type { JobPostPayload, JobPostResponse } from "@/Types/Types";

const apiClients = new APIClient<JobPostPayload, JobPostResponse>("/api/v1/job-postings");

const useJobPost = (onAdd?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<JobPostResponse, Error, JobPostPayload>({
    mutationKey: ["createJob"],
    mutationFn: (data) => apiClients.postAll(data),

    onSuccess: (response) => {
      toast.success("Job created successfully 🎉", {
        position: "top-right",
        style: { color: "#237227" },
      });
      console.log("✅ Job created:", response);

      
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      if (onAdd) onAdd(); 
      
    },

    onError: (error) => {
      toast.error(error?.message || "Failed to create job ❌", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      console.error("❌ Job creation failed:", error.message);
    },
  });
};

export default useJobPost;