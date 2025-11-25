import React from "react";
import CustomInput from "../../../CustomInput/CustomInput";
import FilterItemWrapper from "../FilterItemWrapper/FilterItemWrapper";
import { applyPhoneMask } from "../../../shared/utils/masks";

interface FilterItemStringProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  isPhone?: boolean;
  error?: string;
}

export default function FilterItemString({
  title,
  value,
  onChange,
  isPhone = false,
  error,
}: FilterItemStringProps) {
  return (
    <FilterItemWrapper title={title} isOpenInit={true}>
      <CustomInput
        value={value}
        setValue={onChange}
        maskFunction={isPhone ? applyPhoneMask : undefined}
        placeholder={isPhone ? "+7 (___) ___ - __ - __" : undefined}
        style={error ? { borderColor: "#D92D20" } : undefined}
      />
      {error && <div className="error">{error}</div>}
    </FilterItemWrapper>
  );
}
