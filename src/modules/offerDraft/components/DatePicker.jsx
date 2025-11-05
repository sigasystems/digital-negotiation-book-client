import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid } from "date-fns";

const DatePicker = ({ label, value, onSelect, open, setOpen, editable = true }) => {
  const handleInputChange = (e) => {
    const input = e.target.value;
    if (!input) {
      onSelect("");
      return;
    }

    const parsed = parseISO(input);
    if (isValid(parsed)) {
      onSelect(new Date(parsed).toISOString());
    }
  };

  const formattedDisplay =
    value && isValid(new Date(value))
      ? format(new Date(value), "PPP")
      : "Select a date";

  return (
    <div className="flex flex-col">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        {editable ? (
          <input
            type="date"
            value={
              value
                ? format(new Date(value), "yyyy-MM-dd")
                : ""
            }
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        ) : (
          <div className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-600 min-w-[160px]">
            {formattedDisplay}
          </div>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className="flex items-center justify-center cursor-pointer"
              disabled={!editable}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                if (date) {
                  // Send ISO UTC to parent
                  onSelect(date.toISOString());
                }
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
