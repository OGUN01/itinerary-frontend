import { useState, useCallback } from 'react';
import { useTripStore } from '@/store/trip';
import debounce from 'lodash/debounce';

interface LocationInputProps {
  type: 'origin' | 'destination';
  label: string;
  placeholder: string;
}

export const LocationInput = ({ type, label, placeholder }: LocationInputProps) => {
  const [value, setValue] = useState('');
  const setLocation = useTripStore((state) => state.setLocation);

  // Debounce the update to the global state
  const debouncedSetLocation = useCallback(
    debounce((value: string) => {
      setLocation(type, value);
    }, 300),
    [type, setLocation]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSetLocation(newValue);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}; 