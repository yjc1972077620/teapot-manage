import React, { useMemo } from 'react';
import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

type DateTimePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
};

const parseToDayjs = (value?: string): Dayjs | null => {
  if (!value) return null;
  if (value.includes('T')) {
    return dayjs(value);
  }
  if (value.includes(' ')) {
    return dayjs(value.replace(' ', 'T'));
  }
  return dayjs(value);
};

const AppDateTimePicker = ({
  value,
  onChange,
  placeholder = '请选择日期时间',
  className = '',
  label = '',
  disabled = false
}: DateTimePickerProps) => {
  const pickerValue = useMemo(() => parseToDayjs(value), [value]);

  const handleChange = (date: Dayjs | null) => {
    if (!date) {
      onChange?.('');
      return;
    }
    // 保持旧组件输出格式（datetime-local）
    onChange?.(date.format('YYYY-MM-DDTHH:mm'));
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label}
        </label>
      )}
      <DatePicker
        value={pickerValue}
        onChange={handleChange}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${className}`}
        popupClassName="date-time-picker-popup"
      />
    </div>
  );
};

export default AppDateTimePicker;
