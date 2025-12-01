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
import Scripts from "../../../shared/utils/clientScripts";

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
  contractorId?: string;
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
    contractorId,
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

  const [filters, setFilters] = useState<ISearchInteractionsParams>({});

  const [hasSearched, setHasSearched] = useState(false);
  const applyFiltersHandler = (newFilters: ISearchInteractionsParams) => {
    setFilters(newFilters);
    setSearchParams(newFilters);
    setHasSearched(true);
  };
  const clearFiltersHandler = () => {
    setHasSearched(false);
  };

  /** Восстановление состояния при монтировании */
  useEffect(() => {
    if (!contractorId) return;

    const savedState = localStorage.getItem("interactions-tab-draft");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setFilters(parsed.filters || {});
      setSearchParams(parsed.searchParams || {});

      // Очистка URL
      const url = new URL(window.location.href);
      url.searchParams.delete("contractorId");
      window.history.replaceState({}, "", url.toString());
    }
  }, [contractorId]);

  /** Сохраняем состояние */
  const saveState = () => {
    const stateToSave = {
      filters,
      searchParams,
      sortData,
    };
    localStorage.setItem("interactions-tab-draft", JSON.stringify(stateToSave));
  };

  return (
    <div className="interactions-tab">
      {!isShowFilters && (
        <Button
          title={icons.FilterButton}
          clickHandler={toggleShowFilters}
          style={{
            rotate: "180deg",
            backgroundColor: "transparent",
            marginRight: "-20px",
            marginTop: "10px",
          }}
        />
      )}
      {isShowFilters && (
        <div className="interactions-tab__filters">
          <FilteredInteractions
            filters={filters}
            setFilters={setFilters}
            clickFilterHandler={toggleShowFilters}
            setSearchParams={applyFiltersHandler}
            clearSearch={() => clearFiltersHandler()}
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
              saveState={saveState}
              hasSearched={hasSearched}
            />
          </div>
          <div className="interactions-tab__pagination">
            <PageSelector
              elementsCount={elementsCount}
              clearItemsHandler={clearItemsHandler}
              addItemsHandler={addItemsHandler}
              resetTrigger={resetTrigger}
              filteredElementsCount={filteredElementsCount}
              isVisible={filteredElementsCount > 20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
