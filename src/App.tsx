import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import SignUp from "src/components/auth/SignUp";
import Login from "src/components/auth/Login";
import ScheduleInterview from "src/components/candidate/ScheduleInterview";
import DocumentsUpload from "src/components/candidate/DocumentsUpload";
import Jobs from "src/components/candidate/Jobs";
import ProtectedRoute from "src/components/routes/ProtectedRoute";
import PublicRoute from "src/components/routes/PublicRoute";
import UserLogin from "./components/candidate/UserLogin";
import Dashboard from "./components/candidate/Dashboard";
import ConfirmEmail from "./components/auth/ConfirmEmail";
import VerificationCode from "./components/auth/VerificationCode";
import JobApplicationForm from "./components/candidate/Test";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes — redirect away if already logged in */}
        <Route path="/signup" element={
          <PublicRoute><SignUp /></PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/confirmEmail" element={
          <PublicRoute><ConfirmEmail/></PublicRoute>
        } />
        <Route path="/verifyCode" element={
          <PublicRoute><VerificationCode/></PublicRoute>
        }/>
        <Route path="/test" element={<PublicRoute> <JobApplicationForm/> </PublicRoute>}/>

        {/* Admin & PCD Officer routes */}
        {/* <Route path="/home" element={
          <ProtectedRoute allowedRoles={["ADMIN", "PCD_OFFICER"]}>
            <UserLogin />
          </ProtectedRoute>
        }>
          {/* <Route path="interview-schedules" element={<Schedule />} />
          <Route path="documents" element={<Document />} /> */}
        {/* </Route> */} */

        {/* Applicant routes */}
        <Route path="/home" element=
         {
           <ProtectedRoute allowedRoles={["External Applicant", "Internal Applicant"]}>
             <UserLogin />
           </ProtectedRoute>
        }> 
          <Route path="jobs" element={<Jobs />} />
          <Route path="/home" element={<Dashboard/>}/>
          <Route path="interview-schedule" element={<ScheduleInterview />} />
          <Route path="documents-upload" element={<DocumentsUpload />} />
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500 text-xl font-semibold">
              🚫 You are not authorized to view this page.
            </p>
          </div>
        } />

        {/* Fallback — any unknown route goes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </div>
  );
};

export default App;