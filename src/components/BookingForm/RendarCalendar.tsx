import { useState } from "react";
import CalendarBook from "./CalendarBook"
import { today, getLocalTimeZone } from "@internationalized/date"
import type { DateValue } from "@react-types/calendar"

const TIME_SLOTS: string[] = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
];

interface RendarCalendarProps {
  onTimeSelect?: (date: string, time: string) => void;
}

const RendarCalendar = ({ onTimeSelect }: RendarCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

 const handleDateChange = (date: DateValue): void => {
  const formatted = new Date(date.year, date.month - 1, date.day)
    .toLocaleDateString("en-US", {
      weekday: "long",  
      year: "numeric",  
      month: "long",    
      day: "numeric",   
    });
  setSelectedDate(formatted); 
};

  const handleTimeClick = (time: string): void => {
    if (selectedDate && onTimeSelect) {
      onTimeSelect(selectedDate, time); 
    }
  };

  return (
    <div className="flex gap-6 w-full">
      
      <CalendarBook
        minValue={today(getLocalTimeZone())}
        onChange={handleDateChange}
      />

      
      {selectedDate && (
        <>
          <div className="w-px bg-gray-200 self-stretch" />
          <div className="flex flex-col gap-2 min-w-32.5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">{selectedDate}</h3>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className="w-full py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors cursor-pointer text-left"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RendarCalendar;
