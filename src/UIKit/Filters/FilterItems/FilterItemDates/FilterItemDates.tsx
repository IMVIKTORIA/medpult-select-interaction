import React, { useState, useEffect } from "react";
import FilterItemWrapper from "../FilterItemWrapper/FilterItemWrapper";
import CustomInputDate from "../../../CustomInputDate/CustomInputDate";
import CustomInput from "../../../CustomInput/CustomInput";
import masks from "../../../shared/utils/masks";
import { showError } from "../../../shared/utils/utils";

interface FilterItemDateProps {
  title: string;
  valueFrom?: string;
  valueTo?: string;
  timeFrom?: string;
  timeTo?: string;
  onChange: (val: {
    dateFrom?: string;
    dateTo?: string;
    timeFrom?: string;
    timeTo?: string;
  }) => void;
}

export default function FilterItemDate({
  title,
  valueFrom,
  valueTo,
  timeFrom,
  timeTo,
  onChange,
}: FilterItemDateProps) {
  const [localTimeFrom, setLocalTimeFrom] = useState(timeFrom ?? "");
  const [localTimeTo, setLocalTimeTo] = useState(timeTo ?? "");
  const [isInvalidDateTo, setIsInvalidDateTo] = useState(false);

  //   Вспомогательные функции
  /** Парс строки даты+время в Date */
  const parseDateTime = (date?: string, time?: string): Date | null => {
    if (!date) return null;
    const d = time ? `${date} ${time}` : `${date} 00:00`;
    const t = new Date(d);
    return isNaN(t.getTime()) ? null : t;
  };

  /** Проверка диапазона */
  const validateRange = (
    fromDate: Date | null,
    toDate: Date | null
  ): boolean => {
    if (fromDate && toDate && toDate < fromDate) {
      showError("'Дата по' не может быть раньше 'Даты с'");
      setIsInvalidDateTo(true);
      return false;
    }
    return true;
  };

  const handleDateFrom = (date: string) => {
    const from = parseDateTime(date, localTimeFrom);
    const to = parseDateTime(valueTo, localTimeTo);

    // Если диапазон некорректен — очищаем "по"
    if (!validateRange(from, to)) {
      onChange({
        dateFrom: date,
        dateTo: undefined,
        timeFrom: localTimeFrom,
        timeTo: undefined,
      });
      setLocalTimeTo("");
      return;
    }

    setIsInvalidDateTo(false);

    onChange({
      dateFrom: date,
      dateTo: valueTo,
      timeFrom: localTimeFrom,
      timeTo: localTimeTo,
    });
  };

  const handleDateTo = (date: string) => {
    const from = parseDateTime(valueFrom, localTimeFrom);
    const to = parseDateTime(date, localTimeTo);

    if (!validateRange(from, to)) return;
    setIsInvalidDateTo(false);

    onChange({
      dateFrom: valueFrom,
      dateTo: date,
      timeFrom: localTimeFrom,
      timeTo: localTimeTo,
    });
  };

  const handleTimeFrom = (val: string) => {
    const masked = masks.applyTimeMask(val);
    setLocalTimeFrom(masked);

    const from = parseDateTime(valueFrom, masked);
    const to = parseDateTime(valueTo, localTimeTo);

    if (!validateRange(from, to)) {
      onChange({
        dateFrom: valueFrom,
        dateTo: undefined,
        timeFrom: masked,
        timeTo: undefined,
      });
      setLocalTimeTo("");
      return;
    }

    onChange({
      dateFrom: valueFrom,
      dateTo: valueTo,
      timeFrom: masked,
      timeTo: localTimeTo,
    });
  };

  const handleTimeTo = (val: string) => {
    const masked = masks.applyTimeMask(val);
    setLocalTimeTo(masked);

    const from = parseDateTime(valueFrom, localTimeFrom);
    const to = parseDateTime(valueTo, masked);

    if (!validateRange(from, to)) return;

    setIsInvalidDateTo(false);

    onChange({
      dateFrom: valueFrom,
      dateTo: valueTo,
      timeFrom: localTimeFrom,
      timeTo: masked,
    });
  };

  useEffect(() => {
    setLocalTimeFrom(timeFrom ?? "");
  }, [timeFrom]);

  useEffect(() => {
    setLocalTimeTo(timeTo ?? "");
  }, [timeTo]);

  return (
    <FilterItemWrapper title={title} isOpenInit={true}>
      <div className="filter-item-date">
        <div className="filter-item-date__group">
          <CustomInputDate
            type="date"
            value={valueFrom || ""}
            setValue={handleDateFrom}
            placeholder="с"
          />
          <CustomInput
            type="text"
            value={localTimeFrom}
            setValue={handleTimeFrom}
            placeholder="00:00"
            width={72}
          />
        </div>

        <div className="filter-item-date__group">
          <CustomInputDate
            type="date"
            value={valueTo || ""}
            setValue={handleDateTo}
            isInvalid={isInvalidDateTo}
            placeholder="по"
          />
          <CustomInput
            type="text"
            value={localTimeTo}
            setValue={handleTimeTo}
            placeholder="00:00"
            width={72}
          />
        </div>
      </div>
    </FilterItemWrapper>
  );
}
