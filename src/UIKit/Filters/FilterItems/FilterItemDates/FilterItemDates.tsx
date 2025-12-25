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
  errorFrom?: string;
  errorTo?: string;
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
  errorFrom,
  errorTo,
}: FilterItemDateProps) {
  const [localTimeFrom, setLocalTimeFrom] = useState(timeFrom ?? "");
  const [localTimeTo, setLocalTimeTo] = useState(timeTo ?? "");
  const [isInvalidDateTo, setIsInvalidDateTo] = useState(false);

  //   Вспомогательные функции
  /** Парс строки даты+время в Date */
  const parseDateTime = (date?: string, time?: string): Date | null => {
    if (!date) return null;

    const normalizedTime = normalizeTime(time) ?? "00:00";
    const d = `${date} ${normalizedTime}`;

    const t = new Date(d);
    return isNaN(t.getTime()) ? null : t;
  };

  //Приведение времени к правильному формату
  const normalizeTime = (time?: string): string | undefined => {
    if (!time) return undefined;
    // только часы → HH:00
    if (/^\d{1,2}$/.test(time)) {
      return `${time.padStart(2, "0")}:00`;
    }
    // HH: → HH:00
    if (/^\d{1,2}:$/.test(time)) {
      return `${time.padStart(5, "0")}00`;
    }
    // HH:M → HH:0M
    if (/^\d{1,2}:\d$/.test(time)) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:0${m}`;
    }
    return time;
  };

  /** Проверка диапазона */
  const validateRange = (
    fromDate: Date | null,
    toDate: Date | null
  ): boolean => {
    return true;
  };

  //Дата "с"
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

  //Дата "по"
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
  //Время "с"
  const handleTimeFrom = (val: string) => {
    const masked = masks.applyTimeMask(val);
    setLocalTimeFrom(masked);

    onChange({
      dateFrom: valueFrom,
      dateTo: valueTo,
      timeFrom: masked,
      timeTo: localTimeTo,
    });
  };

  //Время "по"
  const handleTimeTo = (val: string) => {
    const masked = masks.applyTimeMask(val);
    setLocalTimeTo(masked);

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
            style={errorFrom ? { borderColor: "#D92D20" } : undefined}
          />
          <CustomInput
            type="text"
            value={localTimeFrom}
            setValue={handleTimeFrom}
            placeholder="00:00"
            width={72}
            onBlur={() => {
              const normalized = normalizeTime(localTimeFrom);
              if (!normalized) return;
              setLocalTimeFrom(normalized);
              onChange({
                dateFrom: valueFrom,
                dateTo: valueTo,
                timeFrom: normalized,
                timeTo: localTimeTo,
              });
            }}
          />
        </div>
        {errorFrom && (
          <div className="filter-item-date__error">Укажите дату</div>
        )}
        <div className="filter-item-date__group">
          <CustomInputDate
            type="date"
            value={valueTo || ""}
            setValue={handleDateTo}
            placeholder="по"
            style={errorTo ? { borderColor: "#D92D20" } : undefined}
          />
          <CustomInput
            type="text"
            value={localTimeTo}
            setValue={handleTimeTo}
            placeholder="00:00"
            width={72}
            onBlur={() => {
              const normalized = normalizeTime(localTimeTo);
              if (!normalized) return;
              setLocalTimeTo(normalized);
              onChange({
                dateFrom: valueFrom,
                dateTo: valueTo,
                timeFrom: localTimeFrom,
                timeTo: normalized,
              });
            }}
          />
        </div>
        {errorTo && <div className="filter-item-date__error">Укажите дату</div>}
      </div>
    </FilterItemWrapper>
  );
}
