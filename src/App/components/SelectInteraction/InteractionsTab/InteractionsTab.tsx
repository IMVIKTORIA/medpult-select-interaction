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
import { cleanFilters } from "../../../shared/utils/utils.ts";
//import Scripts from "../../../shared/utils/clientScripts";

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
  /** Открыть Модальное окно ответа на сообщение */
  handleOpenReplyModal: (interactionId: string) => void;
  /** Открыть Модальное окно пересылки сообщения */
  handleOpenForwardModal: (interactionId: string) => void;
  /** Идентификатор взаимодействия открытого по умолчанию */
  initialInteractionId: string | undefined;

  savedFilters?: ISearchInteractionsParams | null;
  savedHasSearched?: boolean;
  saveListState?: (
    filters: ISearchInteractionsParams,
    hasSearched: boolean,
    openedId?: string
  ) => void;
}

/** Вкладка взаимодействий */
export default function InteractionsTab(props: IInteractionsTabProps) {
  const {
    handleResetList,
    getInteractionsCount,
    setFilteredElementsCount,
    elementsCount,
    clearItemsHandler,
    addItemsHandler,
    resetTrigger,
    filteredElementsCount,
    initialInteractionId,
  } = props;

  const { sortData, toggleSort } = useSort();

  const [searchParams, setSearchParams] = useState<ISearchInteractionsParams>(
    {}
  );

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
  // Состояние фильтров
  const [filters, setFilters] = useState<ISearchInteractionsParams>({});
  // Был ли произведен поиск
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  //Применить фильтры
  const applyFiltersHandler = (newFilters: ISearchInteractionsParams) => {
    const cleanedFilters = cleanFilters(newFilters);
    setFilters(cleanedFilters);
    setSearchParams(cleanedFilters);
    setHasSearched(true);
  };
  //Очистить фильтры
  const clearFiltersHandler = () => {
    setHasSearched(false);
  };

  useEffect(() => {
    if (props.savedFilters) {
      applyFiltersHandler(props.savedFilters);
    }
  }, [props.savedFilters]);

  // При клике на "Переслать" вызываем сохранение состояния
  const handleForwardClick = () => {
    props.saveListState?.(filters, hasSearched);
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
              hasSearched={hasSearched}
              onForwardClick={handleForwardClick}
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
