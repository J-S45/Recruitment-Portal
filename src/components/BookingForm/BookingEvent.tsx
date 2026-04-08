import { useState } from "react";
import { CalendarX2, Clock, User, CheckCircle, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import RendarCalendar from "./RendarCalendar";


interface ConfirmedBooking {
  date: string;
  time: string;
}



interface LoggedInUser {
  fullName?: string;
  email?: string;
}

interface BookingPopupProps {
  date: string;
  time: string;
  user: LoggedInUser;
  onConfirm: () => void;
  onCancel: () => void;
}

const BookingPopup = ({ date, time, user, onConfirm, onCancel }: BookingPopupProps) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-90 shadow-2xl flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <span className="text-base font-bold text-gray-800">Your Booking Details</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CalendarX2 size={16} className="text-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{time}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Name</span>
          <span className="text-sm text-gray-400 italic">{user?.fullName ?? "Guest"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Email</span>
          <span className="text-sm text-gray-400 italic">{user?.email ?? "guest@email.com"}</span>
        </div>
        
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Cancel Booking
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 rounded-lg text-sm font-bold text-black cursor-pointer transition-colors"
        >
          Confirm Booking ✓
        </button>
      </div>
    </div>
  </div>
);

const BookingEvent = () => {
  const loggedInUser: LoggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

   
  
  const handleTimeSelect = (date: string, time: string): void => {
    setPendingDate(date);
    setPendingTime(time);
    setShowPopup(true);
  };

  const handleConfirm = (): void => {
    setConfirmedBooking({ date: pendingDate!, time: pendingTime! });
    setShowPopup(false);
    setPendingDate(null);
    setPendingTime(null);
  };

  const handleCancel = (): void => {
    setShowPopup(false);
    setPendingDate(null);
    setPendingTime(null);
  };

  return (
    <div className="w-full h-full flex flex-col p-6">

      {/* Popup */}
      {showPopup && pendingDate && pendingTime && (
        <BookingPopup
          date={pendingDate}
          time={pendingTime}
          user={loggedInUser}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      <Card className="w-full h-full">
        <CardContent className="p-6 h-full grid grid-cols-[1fr_auto_1fr] gap-6">

          {/* LEFT — User Info + Confirmed Booking */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {loggedInUser?.fullName ?? "Guest"}
                </span>
                <span className="text-xs text-gray-400">{loggedInUser?.email ?? ""}</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-3 mt-2">
              <p className="flex items-center">
                <CalendarX2 className="size-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {confirmedBooking?.date ?? "No date selected"}
                </span>
              </p>
              <p className="flex items-center">
                <Clock className="size-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {confirmedBooking?.time ?? "30 Minutes"}
                </span>
              </p>
            </div>

            {/* Confirmed Summary */}
            {confirmedBooking && (
              <div className="bg-green-50 border border-green-300 rounded-xl p-4 flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Booking Confirmed</span>
                </div>
                <Separator className="bg-green-200" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Date:</span>
                    <span className="text-xs font-semibold text-gray-800">{confirmedBooking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Time:</span>
                    <span className="text-xs font-semibold text-gray-800">{confirmedBooking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Name:</span>
                    <span className="text-xs text-gray-400">{loggedInUser?.fullName }</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Email:</span>
                    <span className="text-xs text-gray-400">{loggedInUser?.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-full w-px" />

          {/* RIGHT — Calendar + Time Slots */}
          <div className="flex  justify-center items-start w-full">
            <RendarCalendar onTimeSelect={handleTimeSelect} /> 
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default BookingEvent;