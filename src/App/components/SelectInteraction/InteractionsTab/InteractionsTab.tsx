import React, { useEffect, useState } from "react";
import { SearchParams, SortData } from "../../../shared/types.ts";
import FilteredInteractions from "../FilteredInteractions/FilteredInteractions.tsx";
import InteractionsList from "../InteractionsList/InteractionsList.tsx";
import {
  IInteractionItem,
  ISearchInteractionsParams,
} from "../InteractionsList/InteractionsListTypes.ts";
import { useSort } from "../../../shared/hooks.ts";
import PageSelector from "../PageSelector/PageSelector.tsx";
import Button from "../../../../UIKit/Button/Button.tsx";
import icons from "../../../../UIKit/shared/icons.tsx";

export interface IInteractionsTabProps {
  /** Установить обработчик подгрузки данных */
  setLoadData: React.Dispatch<
    React.SetStateAction<(page: number, size: number) => Promise<void>>
  >;
  /** Установить обработчик очистки списка */
  setClearList: React.Dispatch<React.SetStateAction<() => void>>;
  /** Установить количество отфильтрованных элементов */
  setFilteredElementsCount: React.Dispatch<React.SetStateAction<number>>;
  /** Получить количество взаимодействий */
  getInteractionsCount: (
    searchParams: ISearchInteractionsParams
  ) => Promise<number>;
  /** Обработчик получения взаимодействий */
  getInteractions: (
    searchParams: SearchParams<ISearchInteractionsParams>
  ) => Promise<IInteractionItem[]>;
  /** Скрытвать поле выбора сотрудника в фильтрах */
  hideEmployeeFilter?: boolean;
  /** Обработчик сброса списка и его контролера */
  handleResetList: () => void;

  elementsCount: number;
  clearItemsHandler: () => void;
  addItemsHandler: (page: number, size: number) => Promise<void>;
  resetTrigger: Date;
  filteredElementsCount: number;
}

/** Вкладка взаимодействий */
export default function InteractionsTab(props: IInteractionsTabProps) {
  const [searchParams, setSearchParams] = useState<ISearchInteractionsParams>(
    {}
  );
  const {
    handleResetList,
    getInteractionsCount,
    setFilteredElementsCount,
    elementsCount,
    clearItemsHandler,
    addItemsHandler,
    resetTrigger,
    filteredElementsCount,
  } = props;
  const { sortData, toggleSort } = useSort();

  useEffect(() => {
    handleResetList();
  }, [searchParams, sortData]);

  // Обновление количества отфильтрованных Взаимодействий
  const updateFilteredElementsCount = async () => {
    const count = await getInteractionsCount(searchParams);
    setFilteredElementsCount(count);
  };

  useEffect(() => {
    updateFilteredElementsCount();
  }, [searchParams]);

  const [isShowFilters, setIsShowFilters] = useState<boolean>(true);
  const toggleShowFilters = () => setIsShowFilters(!isShowFilters);

  return (
    <div className="interactions-tab">
      {!isShowFilters && (
        <Button
          title={icons.FilterButton}
          clickHandler={toggleShowFilters}
          style={{
            rotate: "180deg",
            padding: "6px",
            height: "40px",
            width: "40px",
          }}
        />
      )}
      {isShowFilters && (
        <div className="interactions-tab__filters">
          <FilteredInteractions
            clickFilterHandler={toggleShowFilters}
            setSearchParams={setSearchParams}
          />
        </div>
      )}
      <div>
        <div className="interactions-tab__content">
          <div className="interactions-tab__list">
            <InteractionsList
              {...props}
              sortData={sortData}
              toggleSort={toggleSort}
              searchParams={searchParams}
            />
          </div>
          <div className="interactions-tab__pagination">
            <PageSelector
              elementsCount={elementsCount}
              clearItemsHandler={clearItemsHandler}
              addItemsHandler={addItemsHandler}
              resetTrigger={resetTrigger}
              filteredElementsCount={filteredElementsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
