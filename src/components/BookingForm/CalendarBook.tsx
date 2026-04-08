import { useLocale } from "react-aria-components";
import { useCalendar } from "@react-aria/calendar"; 
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import CalendarHeader from "./CalendarHeader";
import type { DateValue } from "@react-types/calendar";
import type { AriaCalendarProps } from "@react-aria/calendar";
import CalendarGrid from "./CalendarGrid";

const CalendarBook = (props: AriaCalendarProps<DateValue>) => {
  const { locale } = useLocale();

  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);

  return (
    <div {...calendarProps} className="w-full">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
        title={title} 
      />

      <div className="flex gap-8">
        <CalendarGrid state={state}/>
      </div>

    </div>
  );
};

export default CalendarBook;