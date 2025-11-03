import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const DatePicker = ({ label, value, onSelect, open, setOpen }) => (
  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal cursor-pointer">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value ? new Date(value) : undefined} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  </div>
);

export default DatePicker;
