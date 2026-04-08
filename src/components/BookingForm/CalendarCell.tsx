import { useRef } from "react"
import {mergeProps, useCalendarCell, useFocusRing} from "react-aria"
import type { CalendarState} from "react-stately";
import { CalendarDate, isToday, getLocalTimeZone, isSameMonth } from "@internationalized/date"; 
import { cn } from "@/lib/utils";
// import { isToday } from "date-fns";

const CalendarCell = ({
    state,date,currentMonth
}: {
    state:CalendarState,date:CalendarDate,currentMonth: CalendarDate
}) => {
    let ref = useRef(null);
    let {
        cellProps,buttonProps,isSelected,isDisabled,
        formattedDate,
    } = useCalendarCell({date}, state, ref);

    const {focusProps, isFocusVisible}= useFocusRing();
    const isDateToday = isToday(date, getLocalTimeZone());

    const isOutsideOfMonth = !isSameMonth(currentMonth, date)

  return (
    <td {...cellProps} className={`py-0.5 px-0.5 relative ${isFocusVisible} ? "z-10" : "z-0"`}>
       
        <div {...mergeProps(buttonProps, focusProps)} ref={ref}
        hidden={isOutsideOfMonth} 
        className="size-30 sm:size-35 outline-none group rounded-md">
        <div className={cn("size-full rounded-sm flex items-center justify-center text-sm font-semibold",
        isDisabled ? "text-muted-foreground cursor-not-allowed" : "",
                isSelected ? "bg-amber-400 text-white" :"",
                !isSelected && !isDisabled ? "bg-amber-200" : ""
            
        )}>
{formattedDate}
{isDateToday && (
    <div className={cn("absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-amber-400 rounded-full", isSelected && "bg-white")}/>
)}
        </div>
        </div>
    </td>
  )
}

export default CalendarCell