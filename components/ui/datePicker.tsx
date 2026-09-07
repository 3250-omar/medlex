"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function DatePicker({
  value,
  onChange,
  id,
  disabled = false,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date>();
  const date = value ?? internalDate;
  const today = React.useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }, []);

  function handleSelect(nextDate: Date | undefined) {
    if (value === undefined) setInternalDate(nextDate);
    onChange?.(nextDate);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              "min-h-12 w-full justify-between rounded-xl border-line bg-surface-2/40 px-3.5 text-left font-normal text-text hover:bg-surface-2/70 data-[empty=true]:text-muted-foreground",
              className,
            )}
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
            <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date ?? today}
          disabled={{ before: today }}
        />
      </PopoverContent>
    </Popover>
  );
}

/** @deprecated Use DatePicker. */
export const DatePickerDemo = DatePicker;