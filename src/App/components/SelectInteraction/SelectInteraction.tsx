import React, { useEffect, useState } from "react";
import PageSelector from "./PageSelector/PageSelector.tsx";
import Scripts from "../../shared/utils/clientScripts.ts";
import InteractionsTab from "./InteractionsTab/InteractionsTab.tsx";
import Header from "./Header/Header.tsx";
import Loader from "../../../UIKit/Loader/Loader.tsx";

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

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        await Scripts.OnInit();
      } catch (e) {
        console.error("Ошибка при инициализации:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  return (
    <div className="select-interaction">
      {isInitializing ? (
        <div className="select-interaction__loader">
          <Loader />
        </div>
      ) : (
        <>
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
            />
          </div>
        </>
      )}
    </div>
  );
}
