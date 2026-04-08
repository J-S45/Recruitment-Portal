import APIClient from "@/services/api-clients"
import type { JobPostResponse } from "@/Types/Types"
import { useQuery } from "@tanstack/react-query"



const apiClient = new APIClient<JobPostResponse, JobPostResponse>("/api/v1/job-postings") 

const useJob = () => 
    useQuery({
    queryKey:["jobs"],
    queryFn: () => apiClient.getAll(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 3000
  
});

export default useJob