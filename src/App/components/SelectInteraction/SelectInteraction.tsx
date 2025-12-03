import React, { useEffect, useState, useRef } from "react";
import PageSelector from "./PageSelector/PageSelector.tsx";
import Scripts from "../../shared/utils/clientScripts.ts";
import InteractionsTab from "./InteractionsTab/InteractionsTab.tsx";
import Header from "./Header/Header.tsx";
import Loader from "../../../UIKit/Loader/Loader.tsx";
import SendEmailModal from "./InteractionsList/SendEmailModal/SendEmailModal.tsx";
import { useEmailModalController } from "./InteractionsList/SendEmailModal/SendEmailModalHooks.ts";
import {
  IInteractionItem,
  ISearchInteractionsParams,
} from "./InteractionsList/InteractionsListTypes.ts";

/** Форма отбора взаимодействий */
export default function SelectInteraction() {
  const [elementsCount, setElementsCount] = useState<number>(0);

  const [clearItemsHandler, setClearItemsHandler] = useState<() => void>(
    () => () => {}
  );
  const [addItemsHandler, setAddItemsHandler] = useState<
    (page: number, size: number) => Promise<void>
  >(() => async (page: number, size: number) => {});
  const [filteredElementsCount, setFilteredElementsCount] = useState<number>(0);

  const [lastResetDate, setLastResetDate] = useState<Date>(new Date());
  /** Обработчик сброса списка и его контролера */
  const handleResetList = () => setLastResetDate(new Date());

  const {
    modalProps,
    isModalVisible,
    handleOpenReplyModal,
    handleOpenForwardModal,
    handleCloseModal,
  } = useEmailModalController();

  // --- Состояние для восстановления ---
  const [savedFilters, setSavedFilters] =
    useState<ISearchInteractionsParams | null>(null);
  const [savedHasSearched, setSavedHasSearched] = useState<boolean>(false);
  const [savedInitialInteractionId, setSavedInitialInteractionId] = useState<
    string | undefined
  >(undefined);
  const [initialInteractionId, setInitialInteractionId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    const contractorId = currentURL.searchParams.get("contractorId");
    const interactionId = currentURL.searchParams.get("interaction_id");

    const saved = sessionStorage.getItem("interaction_filters");
    console.log("saved восстанавливаем", saved);
    if (saved) {
      const state = JSON.parse(saved);
      setSavedFilters(state.filters);
      setSavedHasSearched(state.hasSearched);
      setSavedInitialInteractionId(state.openedId);
    }

    if (interactionId) setInitialInteractionId(interactionId);

    if (interactionId && contractorId)
      handleOpenForwardModal(interactionId, contractorId);

    const newUrl = new URL(currentURL);
    newUrl.searchParams.delete("contractorId");
    newUrl.searchParams.delete("interaction_id");
    window.history.replaceState({}, "", newUrl.href);
  }, []);

  // Функция сохранения состояния списка и фильтров
  const saveListState = (
    filters: ISearchInteractionsParams,
    hasSearched: boolean,
    openedId?: string
  ) => {
    const state = {
      filters,
      hasSearched,
      openedId,
    };
    sessionStorage.setItem("interaction_filters", JSON.stringify(state));
    setSavedFilters(filters);
    setSavedHasSearched(hasSearched);
    setSavedInitialInteractionId(openedId);
  };

  return (
    <>
      {isModalVisible && <SendEmailModal {...modalProps} />}
      <div className="select-interaction">
        <div className="select-interaction__header">
          <Header
            title="Взаимодействия"
            status={{ name: "Готов", code: "done" }}
          />
        </div>
        <div className="select-interaction__tabs">
          <InteractionsTab
            setLoadData={setAddItemsHandler}
            setClearList={setClearItemsHandler}
            setFilteredElementsCount={setFilteredElementsCount}
            getInteractions={Scripts.getInteractions}
            getInteractionsCount={Scripts.getInteractionsCount}
            handleResetList={handleResetList}
            elementsCount={elementsCount}
            clearItemsHandler={clearItemsHandler}
            addItemsHandler={addItemsHandler}
            resetTrigger={lastResetDate}
            filteredElementsCount={filteredElementsCount}
            handleOpenReplyModal={handleOpenReplyModal}
            handleOpenForwardModal={handleOpenForwardModal}
            initialInteractionId={initialInteractionId}
            savedFilters={savedFilters}
            savedHasSearched={savedHasSearched}
            saveListState={saveListState}
          />
        </div>
      </div>
    </>
  );
}
