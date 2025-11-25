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
import CustomInput from "../../../CustomInput/CustomInput";

interface FilterItemCategorySearchProps extends FilterItemWrapperProps {
  /** Список вариантов */
  variants: ObjectItem[];
  /** Значение фильтра (выбранные варианты) */
  filterValue: ObjectItem[];
  /** Установить выбранные варианты */
  setFilterValue: (val: ObjectItem[]) => void;
  /** Текущий поисковый запрос */
  searchValue: string;
  /** Установить поисковый запрос */
  setSearchValue: (val: string) => void;
  enableSelectAll?: boolean;
}

export default function FilterItemCategorySearch({
  title,
  variants,
  filterValue,
  setFilterValue,
  searchValue,
  setSearchValue,
  enableSelectAll,
  ...wrapperProps
}: FilterItemCategorySearchProps) {
  const isChecked = (variant: ObjectItem) =>
    Boolean(filterValue.find((v) => v.code === variant.code));

  //Выбрать все
  const allSelected = filterValue.length === variants.length;
  const toggleAll = () => {
    if (allSelected) {
      setFilterValue([]);
    } else {
      setFilterValue([...variants]);
    }
  };

  const toggle = (variant: ObjectItem) => {
    if (isChecked(variant)) {
      setFilterValue(filterValue.filter((v) => v.code !== variant.code));
    } else {
      setFilterValue([...filterValue, variant]);
    }
  };

  // Фильтрация по поиску
  const filteredVariants = variants.filter((v) =>
    v.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FilterItemWrapper title={title} isOpenInit={true} {...wrapperProps}>
      <CustomInput
        value={searchValue}
        setValue={setSearchValue}
        style={{ marginBottom: "10px" }}
      />

      <div className="filter-item-variants-search">
        {enableSelectAll && (
          <CustomInputCheckbox
            title="Все"
            checked={allSelected}
            setValue={toggleAll}
          />
        )}
        {filteredVariants.length ? (
          filteredVariants.map((variant) => (
            <CustomInputCheckbox
              key={variant.code}
              title={variant.value}
              checked={isChecked(variant)}
              setValue={() => toggle(variant)}
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </FilterItemWrapper>
  );
}
