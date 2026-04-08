import {
  ChevronRight, Briefcase, Check, CalendarDays, ClipboardList, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useAppliedJobs from "@/hooks/useAppliedJobs";
import useJob from "@/hooks/useJob";
import { Spinner } from "../ui/spinner";

const STEPS = ["Applied", "Screened", "Interview", "Assessment", "Offer"];

const STATUS_ORDER: Record<string, number> = {
  SUBMITTED: 0, SCREENED: 1, INTERVIEW: 2, ASSESSMENT: 3, OFFER: 4,
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const formatRelative = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
};

// const JOB_COLORS = [
//   "bg-orange-100 text-orange-600", "bg-blue-100 text-blue-600",
//   "bg-purple-100 text-purple-600", "bg-teal-100 text-teal-600",
//   "bg-rose-100 text-rose-600", "bg-green-100 text-green-600",
// ];

// const getInitials = (title: string) =>
//   title.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const Dashboard = () => {
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  }).format(now);

  const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { data: AppliedJobs, isPending } = useAppliedJobs();
  const { data: allJobs, isPending: jobsPending } = useJob();

  const appliedJobIds = new Set(AppliedJobs?.map((a) => a.jobPostingId) ?? []);
  const recommendedJobs = (allJobs ?? [])
    .filter((job) => job.status === "PUBLISHED" && !appliedJobIds.has(job.id))
    .slice(0, 3);

  const totalApplications = AppliedJobs?.length ?? 0;
  const interviewCount = AppliedJobs?.filter((a) => a.status === "INTERVIEW").length ?? 0;
  const offerCount = AppliedJobs?.filter((a) => a.status === "OFFER").length ?? 0;
  const screenedCount = AppliedJobs?.filter((a) => a.status === "SCREENED").length ?? 0;
  const activeApplication = AppliedJobs?.[0] ?? null;
  const activeStepIndex = activeApplication ? (STATUS_ORDER[activeApplication.status] ?? 0) : 0;
  const progressPercent = activeApplication
    ? Math.round((activeStepIndex / (STEPS.length - 1)) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-12">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-6 mt-6">

       
        <div className="relative bg-[#222d32] rounded-2xl overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-sm">{greeting},</p>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                {loggedInUser?.fullName ?? "Guest"}
              </h1>
              <p className="text-amber-400 text-sm mt-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                {formattedDate} · You have {interviewCount} interview{interviewCount !== 1 ? "s" : ""} this week
              </p>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2.5 rounded-lg cursor-pointer self-start sm:self-auto shrink-0"
              onClick={() => navigate("/home/jobs")}
            >
              + Find Jobs
            </Button>
          </div>
        </div>

        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Briefcase className="w-5 h-5 text-teal-600" />, bg: "bg-teal-50", value: totalApplications, label: "APPLICATIONS" },
            { icon: <CalendarDays className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50", value: interviewCount, label: "INTERVIEWS" },
            { icon: <ClipboardList className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50", value: screenedCount, label: "SCREENED" },
            { icon: <Trophy className="w-5 h-5 text-green-600" />, bg: "bg-green-50", value: offerCount, label: "OFFERS" },
          ].map(({ icon, bg, value, label }) => (
            <div key={label} className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm w-full">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                {icon}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"> 

          
          <div className="flex flex-col gap-6 h-full"> 

            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-sm font-bold text-gray-800 leading-snug">
                  Active Application —{" "}
                  <span className="text-gray-700">
                    {activeApplication?.jobTitle ?? "No active application"}
                  </span>
                </h2>
                {activeApplication && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    In Progress
                  </span>
                )}
              </div>

              {activeApplication && (
                <p className="text-xs text-gray-400 mb-6">
                  Applied {formatDate(activeApplication.appliedAt)}
                </p>
              )}

              {isPending ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Spinner className="size-5" /> Loading...
                </div>
              ) : !activeApplication ? (
                <p className="text-sm text-gray-400">No active applications.</p>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    {STEPS.map((step, idx) => {
                      const isDone = idx < activeStepIndex;
                      const isCurrent = idx === activeStepIndex;
                      return (
                        <div key={step} className="flex flex-col items-center flex-1 relative">
                          {idx > 0 && (
                            <div className={`absolute top-3.5 right-1/2 w-full h-0.5 -translate-y-1/2 ${idx <= activeStepIndex ? "bg-green-500" : "bg-gray-200"}`} />
                          )}
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center z-10 text-xs font-bold relative ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                            {isDone ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : idx + 1}
                          </div>
                          <p className={`text-[9px] sm:text-xs mt-1 text-center leading-tight ${isCurrent ? "text-orange-500 font-semibold" : isDone ? "text-green-600" : "text-gray-400"}`}>
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400">Application progress</span>
                      <span className="text-xs text-gray-600 font-semibold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto"
                    onClick={() => navigate("/home/interview-schedule")}
                  >
                    Prepare for Interview <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>

            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1"> {/* ← flex-1 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">Recent Activity</h2>
                <button className="text-xs text-teal-600 hover:underline cursor-pointer">See all</button>
              </div>

              {isPending ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Spinner className="size-5" /> Loading...
                </div>
              ) : !AppliedJobs || AppliedJobs.length === 0 ? (
                <p className="text-sm text-gray-400">No recent activity.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {AppliedJobs.slice(0, 3).map((app) => {
                    const dotColor =
                      app.status === "INTERVIEW" ? "bg-green-500" :
                      app.status === "SCREENED" ? "bg-blue-400" :
                      app.status === "SUBMITTED" ? "bg-amber-400" : "bg-gray-400";

                    const activityLabel =
                      app.status === "INTERVIEW" ? "Interview Scheduled" :
                      app.status === "SCREENED" ? "Application Screened" :
                      app.status === "ASSESSMENT" ? "Assessment Assigned" :
                      app.status === "OFFER" ? "Offer Received" : "Application Submitted";

                    return (
                      <div key={app.id} className="flex gap-3 items-start">
                        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{activityLabel}</p>
                          <p className="text-xs text-gray-500 truncate">{app.jobTitle}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{formatRelative(app.appliedAt)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          
          <div className="flex flex-col gap-6 h-full"> 

            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">Upcoming</h2>

              {isPending ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Spinner className="size-5" /> Loading...
                </div>
              ) : !AppliedJobs?.filter((a) => a.status === "INTERVIEW").length ? (
                <p className="text-sm text-gray-400">No upcoming interviews.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {AppliedJobs.filter((a) => a.status === "INTERVIEW").map((app, idx) => {
                    const date = new Date(app.appliedAt);
                    const day = date.getDate();
                    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
                    const isFirst = idx === 0;

                    return (
                      <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-10 h-12 rounded-lg bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-amber-500 leading-none">{month}</span>
                          <span className="text-lg font-bold text-amber-700 leading-tight">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">Panel Interview</p>
                          <p className="text-xs text-gray-500 truncate">{app.jobTitle} · 10:00 AM · Zoom</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${isFirst ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {isFirst ? "Tomorrow" : `${Math.abs(Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000))}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recommended for You — flex-1 fills remaining height */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1"> {/* ← flex-1 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">Recommended for You</h2>
                <button
                  className="text-xs text-teal-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/home/jobs")}
                >
                  View all
                </button>
              </div>

              {jobsPending || isPending ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Spinner className="size-5" /> Loading...
                </div>
              ) : recommendedJobs.length === 0 ? (
                <p className="text-sm text-gray-400">No new jobs to recommend right now.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recommendedJobs.map((job, idx) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate("/home/jobs")}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${JOB_COLORS[idx % JOB_COLORS.length]}`}>
                        {getInitials(job.jobTitle)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{job.jobTitle}</p>
                        <p className="text-xs text-gray-500 truncate">{job.department} · {job.location}</p>
                      </div>
                      <span className="hidden sm:inline text-xs text-gray-400 shrink-0 capitalize">
                        {job.employmentType.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;