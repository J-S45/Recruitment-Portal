import APIClient from "@/services/api-clients";
import type { JobApplicationResponse } from "@/Types/Types";
import { useQuery } from "@tanstack/react-query";

const apiClient = new APIClient<JobApplicationResponse,JobApplicationResponse>("/api/v1/applications/me")

const useAppliedJobs = () =>
    useQuery({
        queryKey:["AppliedJobs"],
        queryFn:() => apiClient.getAll(),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 3000
});

export default useAppliedJobs;