'use client';
import React, { useState } from 'react';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { FormLabel } from '@chakra-ui/react';

const DatetimePickerHourCycle = () => {
  const [date12, setDate12] = useState<Date | undefined>(undefined);
  const [date24, setDate24] = useState<Date | undefined>(undefined);
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="flex w-72 flex-col">
      
        <DateTimePicker hourCycle={12} value={date12} onChange={setDate12} />
      </div>
    </div>
  );
};

export default DatetimePickerHourCycle;
