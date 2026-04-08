import { User } from "lucide-react";

import BookingEvent from "../BookingForm/BookingEvent";



const ScheduleInterview = () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");



  return (
    <div className="flex-1 flex flex-col">
      <nav className="h-16 bg-amber-400 border-b flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-3xl font-medium">Schedule Interview</h1>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {loggedInUser?.fullName}
            </span>
            <span className="text-xs text-gray-400">
              {loggedInUser?.roles}
            </span>
          </div>
        </div>
      </nav>
      <div className="p-6 w-full min-h-screen bg-gray-50">
        {/* <CalendarApp/>   */}
        <BookingEvent />
      </div>

      {/* <Calendar_App/>    */}
    </div>
  );
};

export default ScheduleInterview;
