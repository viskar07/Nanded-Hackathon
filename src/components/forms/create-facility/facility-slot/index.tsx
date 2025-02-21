"use client";

import { FormGenerator } from "@/components/global/form-generator";
import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FACILITY_SLOT_CREATION_FORM } from "@/constants/form";
import { useCreateFacilitySlot } from "@/hooks/institution";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface FacilitySlotFormProps {
  facilityId: string;
}

const FacilitySlotForm = ({ facilityId }: FacilitySlotFormProps) => {
  const { onSubmit, register, errors, isPending } = useCreateFacilitySlot({ facilityId });
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<Date>()
  const [endTime, setEndTime] = useState<Date>()

  const registerDate = (register: UseFormRegister<any>, name: string) => ({
    onChange: (date: Date) => {
      register(name).onChange({ target: { value: date } });
    },
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {FACILITY_SLOT_CREATION_FORM.map((field) => {
        if (field.id === 'date') {
          return (
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date: Date) => {
                      setDate(date)
                      registerDate(register, "date").onChange(date)
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        } else if (field.id === 'startTime') {
          return (
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="time"
                id="startTime"
                {...register("startTime", { value: format(startTime ? startTime : new Date(), "HH:mm") })}
                onChange={(e) => {
                  setStartTime(new Date(e.target.value))
                  registerDate(register, "startTime").onChange(new Date(e.target.value))
                }}
              />
            </div>
          )
        } else if (field.id === 'endTime') {
          return (
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="time"
                id="endTime"
                {...register("endTime", { value: format(endTime ? endTime : new Date(), "HH:mm") })}
                onChange={(e) => {
                  setEndTime(new Date(e.target.value))
                  registerDate(register, "endTime").onChange(new Date(e.target.value))
                }}
              />
            </div>
          )
        }
        return (
          <FormGenerator key={field.id} {...field} register={register} errors={errors} />
        )
      })}
      <Button type="submit" disabled={isPending}>
        <Loader loading={isPending}>Create Slot</Loader>
      </Button>
    </form>
  );
};

export default FacilitySlotForm;
