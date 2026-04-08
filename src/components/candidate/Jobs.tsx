import { User } from "lucide-react";
import { Input } from "src/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useState } from "react";
import { JOB_CATEGORY } from "@/utils/constants";
import JobDetailsPage from "../../components/candidate/JobDetailsPage";
import useJob from "@/hooks/useJob";
import { Spinner } from "../ui/spinner";

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data: jobs, isLoading, isError } = useJob();
  const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userRole = loggedInUser?.roles?.[0];

  const filteredJobs = (jobs ?? []).filter((job) => {
    const matchesSearch =
      search === "" ||
      job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "" || job.department === category;

    const matchesApplicantType =
      userRole === "External Applicant"
        ? job.applicantType === "External" || job.applicantType === "Both"
        : job.applicantType === "Internal" || job.applicantType === "Both";

    return matchesSearch && matchesCategory && matchesApplicantType;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      
      <nav className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm bg-amber-400">
        <h1 className="text-xl sm:text-3xl font-medium">Jobs</h1>
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-black">
              {loggedInUser?.fullName ?? "Guest"}
            </span>
            <span className="text-xs text-gray-400">
              {userRole?.replace(/_/g, " ") ?? "Guest"} 
            </span>
          </div>
        </div>
      </nav>

      
      <div className="px-4 sm:px-8">
        <h3 className="text-2xl sm:text-3xl text-[#222d32] font-bold mt-8">Open Positions</h3>
        <p className="text-sm sm:text-base text-[#222d32] mt-1">
          Find your next opportunity at CalBank
        </p>
      </div>

      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-5 px-4 sm:px-8 gap-3">
        <Input
          type="text"
          placeholder="Search by Job title..."
          className="h-12 flex-1 border border-gray-300 rounded-full px-4 text-sm sm:text-base focus:ring-1 focus:ring-amber-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full sm:w-56">
          <Select onValueChange={(value) => setCategory(value)} value={category}>
            <SelectTrigger className="w-full cursor-pointer h-12 border border-gray-300 rounded-full py-6 px-4 text-sm focus:ring-1 focus:ring-amber-400">
              <SelectValue placeholder="Search by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {JOB_CATEGORY.map((item) => (
                  <SelectItem key={item.value} value={item.title}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      
      <p className="text-base sm:text-xl text-[#222d32] mt-3 px-4 sm:px-8">
        {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
      </p>

      
      <div className="px-4 sm:px-8 mt-4 pb-10">

        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-400 text-xl sm:text-3xl">
            <Spinner className="size-10 sm:size-16" /> Loading jobs...
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-red-400 text-xl sm:text-3xl">
            Failed to load jobs. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4"> 
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border-2 border-gray-300 py-5 px-4 sm:px-6 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200 bg-gray-100"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-black text-xl sm:text-3xl font-semibold mt-1">
                      {job.jobTitle}
                    </span>

                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{job.department}</span>
                      <span className="text-sm text-gray-600">📍{job.location}</span>
                      <span className="text-sm text-gray-600">
                        {job.applicantType?.replace(/_/g, " ") ?? "N/A"}
                      </span>
                      <span className="text-sm bg-amber-300 rounded-full py-1 px-3">
                        {job.employmentType.replace(/_/g, " ")}
                      </span>
                    </div>

                    
                    <div className="flex justify-end mt-2">
                      <JobDetailsPage job={job} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 text-lg sm:text-xl">
              No jobs found matching "
              <span className="font-medium text-gray-600">{search}</span>"
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default Jobs;