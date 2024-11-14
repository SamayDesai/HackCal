'use client';
import React from 'react';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { FormLabel } from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import './styles.css';

type DatetimePickerHourCycleProps = {
  selectedDate: Dayjs | undefined;
  onDateChange: (date: Dayjs | undefined) => void;
  time: 'start' | 'end';
};

const DatetimePickerHourCycle: React.FC<DatetimePickerHourCycleProps> = ({ selectedDate, onDateChange, time }) => {
  const label = time === 'start' ? 'Pick start date and time' : 'Pick end date and time';

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="flex w-72 flex-col">
        <FormLabel>{label}</FormLabel>
          <DateTimePicker
            hourCycle={12}
            value={selectedDate?.toDate()}    // Convert dayjs to Date for the picker
            onChange={(date) => onDateChange(date ? dayjs(date) : undefined)} // Convert Date to dayjs
            popoverContentClassName="custom-datepicker-popper"
          />
      </div>
    </div>
  );
};

export default DatetimePickerHourCycle;