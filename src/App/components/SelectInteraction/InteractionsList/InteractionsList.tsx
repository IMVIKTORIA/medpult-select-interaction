import React, { useEffect, useState } from "react";
import { useList } from "../../../shared/hooks";
import { SearchParams, SortData } from "../../../shared/types";
import {
  IInteractionItem,
  ISearchInteractionsParams,
  InteractionsSortableFieldCode,
} from "./InteractionsListTypes";
import Scripts from "../../../shared/utils/clientScripts";
import ListHeaderColumn from "../ListComponents/ListHeaderColumn/ListHeaderColumn";
import Loader from "../../../../UIKit/Loader/Loader";
import InteractionsListRow from "./InteractionsListRow/InteractionsListRow";
import { useSortHandlers } from "../ListComponents/ListComponentsHooks";
import { IInteractionsTabProps } from "../InteractionsTab/InteractionsTab";

interface IInteractionsListProps extends IInteractionsTabProps {
  /** Поисковые данные взаимодействий */
  searchParams: ISearchInteractionsParams;
  /** Данные сортировки */
  sortData: SortData | undefined;
  /** Переключить данные сортировки */
  toggleSort: (fieldCode: string) => void;
  /** Был ли поиск */
  hasSearched: boolean;
  /** Открыть Модальное окно ответа на сообщение */
  handleOpenReplyModal: (interactionId: string) => void;
  /** Открыть Модальное окно пересылки сообщения */
  handleOpenForwardModal: (interactionId: string) => void;
  onForwardClick?: () => void;
  /** Идентификатор взаимодействия открытого по умолчанию */
  initialInteractionId: string | undefined;
}

/** Список взаимодействий */
export default function InteractionsList({
  searchParams,
  setLoadData,
  setClearList,
  sortData,
  toggleSort,
  getInteractions,
  hasSearched,
  handleOpenReplyModal,
  handleOpenForwardModal,
  onForwardClick,
  initialInteractionId,
}: IInteractionsListProps) {
  const [openRowIndex, setOpenRowIndex] = useState<string | undefined>(
    undefined
  );

  const { getListColumnProps } = useSortHandlers(sortData, toggleSort);

  const getInteractionsHandler = async (
    searchParams: SearchParams<ISearchInteractionsParams>
  ): Promise<IInteractionItem[]> => {
    const interactions = await getInteractions(searchParams);
    return interactions;
  };

  const { items, clearList, setItems, loadData, isLoading } = useList(
    sortData,
    searchParams,
    getInteractionsHandler
  );

  useEffect(() => {
    console.log("update")
    
    setLoadData(() => loadData);
    setClearList(() => clearList);
  }, [searchParams, sortData]);

  // обновить данные взаимодейтсвия
  const reloadItem = async (id: string) => {
    try {
      const updated = await Scripts.getInteractionById(id);

      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      console.error("Ошибка в функции reloadItem", err);
    }
  };

  useEffect(() => {
    if (initialInteractionId && items.length > 0) {
      setOpenRowIndex(initialInteractionId);
    }
  }, [initialInteractionId, items]);

  return (
    <div className="interactions-list">
      <div className="interactions-list__header">
        <ListHeaderColumn></ListHeaderColumn>
        <ListHeaderColumn></ListHeaderColumn>
        <ListHeaderColumn>Точка входа</ListHeaderColumn>
        <ListHeaderColumn>IVR</ListHeaderColumn>
        <ListHeaderColumn>SLA</ListHeaderColumn>
        <ListHeaderColumn tooltip="Телефон / Email">
          Телефон /<br />
          Email
        </ListHeaderColumn>
        <ListHeaderColumn
          {...getListColumnProps(InteractionsSortableFieldCode.createdAt)}
        >
          Дата и время
        </ListHeaderColumn>
        <ListHeaderColumn>Номер взаимодейтсвия</ListHeaderColumn>
        <ListHeaderColumn
          {...getListColumnProps(InteractionsSortableFieldCode.contractor)}
        >
          Контрагент
        </ListHeaderColumn>
        <ListHeaderColumn></ListHeaderColumn>
        <ListHeaderColumn>Тема обращения</ListHeaderColumn>
        <ListHeaderColumn>Обращение</ListHeaderColumn>
        <ListHeaderColumn>Задача</ListHeaderColumn>
        <ListHeaderColumn
          {...getListColumnProps(InteractionsSortableFieldCode.executor)}
        >
          Исполнитель
        </ListHeaderColumn>
        <ListHeaderColumn></ListHeaderColumn>
      </div>
      <div className="interactions-list__list">
        {!isLoading && items.length === 0 && (
          <div className="interactions-list__empty">
            <span className="interactions-list__empty__title">
              {hasSearched
                ? "Взаимодействие не найдено"
                : "Выполните поиск по взаимодействиям"}
            </span>
            {hasSearched && (
              <span className="interactions-list__empty__subtitle">
                Попробуйте изменить критерии поиска
              </span>
            )}
          </div>
        )}
        {
          items.map((item) => (
            <InteractionsListRow
              key={item.id}
              item={item}
              openRowIndex={openRowIndex}
              setOpenRowIndex={setOpenRowIndex}
              items={items}
              setItems={setItems}
              reloadData={reloadItem}
              handleOpenReplyModal={handleOpenReplyModal}
              handleOpenForwardModal={handleOpenForwardModal}
              onForwardClick={onForwardClick}
            />
          ))}
        {isLoading && <Loader />}
      </div>
    </div>
  );
}
