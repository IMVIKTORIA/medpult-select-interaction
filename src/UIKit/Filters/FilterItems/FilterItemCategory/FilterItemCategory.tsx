import React, { useState } from "react";
import FilterItemWrapper from "../FilterItemWrapper/FilterItemWrapper";
import {
  FilterItemProps,
  ObjectItem,
  ListFilter,
  FilterItemWrapperProps,
} from "../../FiltersTypes";
import CustomInputCheckbox from "../../../CustomInputCheckbox/CustomInputCheckbox";
import Loader from "../../../Loader/Loader";
interface FilterItemCategoryProps extends FilterItemWrapperProps {
  /** Список вариантов */
  variants: ObjectItem[];
  /** Значение фильтра (выбранные варианты) */
  filterValue: ObjectItem[];
  /** Установить выбранные варианты */
  setFilterValue: (val: ObjectItem[]) => void;
}

export default function FilterItemCategory({
  title,
  variants,
  filterValue,
  setFilterValue,
  ...wrapperProps
}: FilterItemCategoryProps) {
  const isChecked = (variant: ObjectItem) =>
    Boolean(filterValue.find((v) => v.code === variant.code));

  const toggle = (variant: ObjectItem) => {
    if (isChecked(variant)) {
      setFilterValue(filterValue.filter((v) => v.code !== variant.code));
    } else {
      setFilterValue([...filterValue, variant]);
    }
  };

  return (
    <FilterItemWrapper title={title} isOpenInit={true} {...wrapperProps}>
      <div className="filter-item-variants">
        {variants.length ? (
          variants.map((variant) => (
            <CustomInputCheckbox
              key={variant.code}
              title={variant.value}
              checked={isChecked(variant)}
              setValue={() => toggle(variant)}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </FilterItemWrapper>
  );
}
