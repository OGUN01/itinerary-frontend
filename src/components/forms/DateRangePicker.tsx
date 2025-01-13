import { useState } from 'react';
import { useTripStore } from '@/store/trip';
import { DateRange } from '@/types/api';
import { format, addDays } from 'date-fns';

interface DateRangePickerProps {
  minDate?: Date;
  maxDate?: Date;
}

export const DateRangePicker = ({ minDate = new Date(), maxDate }: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  
  const setDates = useTripStore((state) => state.setDates);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    updateDates(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    updateDates(startDate, newEndDate);
  };

  const updateDates = (start: string, end: string) => {
    const dateRange: DateRange = {
      start_date: start,
      return_date: end,
    };
    setDates(dateRange);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Start Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={handleStartDateChange}
          min={format(minDate, 'yyyy-MM-dd')}
          max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">End Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
          max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
        />
      </div>
    </div>
  );
}; 