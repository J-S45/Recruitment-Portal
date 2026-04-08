import { Calendar } from "@/components/ui/calendar";
import { useState } from "react"
// import { Time, getLocalTimeZone, isToday } from "@internationalized/date"


// const tz = getLocalTimeZone()
// interface OptionsProps{
//   day: number;
//   month: string;
//   year: number;
// }


const AVAILABLE_TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30"
]

const CalendarApp = () => {
  const [date, setDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

//   const now = new Date();
// const options = {
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   // hour: 'numeric',
//   // minute: 'numeric'
// }
// const locale = navigator.language
// new Intl.DateTimeFormat(locale, options).format(now);

  return (
    <div className="flex sx-react-calendar-wrapper flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden">

      {/* Calendar side */}
      <div className="w-1/2 border-b md:border-b-0 md:border-r border-gray-200">
        <div className="px-5 py-5">
          <p className="font-semibold text-center text-base">Select a Date</p>
          <p className="text-base text-center text-gray-400">Pick a day for your interview</p>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => { setDate(d); setSelectedTime(null); }}
          disabled={(d) => d.getDay() === 0 || d.getDay() === 6} // disable weekends
          className="w-full text-base font-semibold "
        />

        {/* <div className="flex items-center gap-2 px-5 pb-4 text-xs text-gray-400">
          <LuGlobe />
          <span>{tz}</span>
        </div> */}
      </div>

      {/* Time slots side */}
      <div className="w-1/2 flex flex-col">
        {date ? (
          <>
            <div className="px-5 pt-5 pb-3">
              <p className="font-semibold">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="text-sm text-gray-400">
                {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 px-20 overflow-y-auto ">
              {AVAILABLE_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                  className={`py-8 px-6 rounded-lg border text-base font-semibold transition-all ${
                    selectedTime === time
                      ? "bg-amber-400 border-amber-400 text-black"
                      : "border-gray-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-8 py-10 text-center text-gray-400">
            <div>
              <p className="text-base text-center font-medium">Select a date</p>
              <p className="text-base text-center mt-1">Available slots will appear here</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default CalendarApp