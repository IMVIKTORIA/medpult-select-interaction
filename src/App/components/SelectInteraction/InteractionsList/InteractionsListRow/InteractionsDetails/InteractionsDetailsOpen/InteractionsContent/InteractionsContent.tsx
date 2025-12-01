import React, { useEffect, useState } from "react";
import CustomButton from "../../../../../../../../UIKit/Button/CustomButton/CustomButton";
import InteractionField from "../InteractionsField/InteractionField";
import icons from "../../../../icons";
import {
  IInteractionDetailsItem,
  FilesData,
  SendEmailAction,
} from "../../../../InteractionsListTypes";
import FilesDropdown from "./FilesDropdown/FilesDropdown";
import Scripts from "../../../../../../../shared/utils/clientScripts";
import utils, {
  onClickDownloadFileByUrl,
} from "../../../../../../../shared/utils/utils";
import SendEmailModal from "../../SendEmailModal/SendEmailModal";

/** Пропсы */
interface InteractionsContentProps {
  data: IInteractionDetailsItem;
  /** id Взаимодействия */
  interactionId: string;
  /** Идентификатор задачи */
  taskId?: string;
  /** Сохранение состояния вкладки */
  saveState: () => void;
}

function InteractionsContent({
  data,
  interactionId,
  saveState,
}: InteractionsContentProps) {
  /** Выпадающий список для файлов */
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  /** Обработка нажатия на кнопку скачать файл */
  const handleSaveClick = async (file?: FilesData) => {
    if (!file) return;
    await onClickDownloadFileByUrl(file.fileDownloadURL, file.nameFiles);
  };

  /** Обработка нажатия на кнопку скачать все файлы */
  const handleSaveAllClick = async (files?: FilesData[]) => {
    if (!files?.length) return;
    for (const file of files) {
      onClickDownloadFileByUrl(file.fileDownloadURL, file.nameFiles);
    }
  };

  // Состояние для открытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"reply" | "forward" | null>(null);
  const [modalData, setModalData] = useState<
    Partial<SendEmailAction> | undefined
  >(undefined);

  // Закрытие модалки
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /** Обработка нажатия на кнопку ответить */
  const handleReplyClick = async () => {
    const data = await Scripts.getEmailDataByInteractionId(interactionId);
    console.log("data", data);
    setModalData({
      text: data.text,
      contractor: data.contractor,
      session: data.session,
    });
    setModalMode("reply");
    setIsModalOpen(true);
  };
  /** Обработка нажатия на кнопку переслать */
  const handleForwardClick = async () => {
    const data = await Scripts.getEmailDataByInteractionId(interactionId);
    console.log("data", data);
    setModalData({
      text: data.text,
      topic: data.topic,
      filesData: data.filesData,
    });
    setModalMode("forward");
    setIsModalOpen(true);
  };

  /** Получение иконки по статусу взаимодействия */
  const getIcon = (status: string) => {
    switch (status) {
      case "new":
        return icons.InteracrionNew;
      case "queue":
        return icons.InteracrionQueue;
      case "atWork":
        return icons.InteracrionAtWork;
      case "processed":
        return icons.InteracrionProcessed;
      case "missed":
        return icons.InteracrionMissed;
      default:
        return null;
    }
  };

  return (
    <div className="interactions-open-panel-content">
      {/* От Кого */}
      <InteractionField label="От кого">
        <span className="interactions-open-panel-content__object">
          <span className="interactions-open-panel-content__value">
            {data.fioFrom}
          </span>
          <span
            className="interactions-open-panel-content__value"
            title={data.email}
          ></span>
          <div className="interactions-open-panel-content__buttons">
            {/* Кнопка Ответить*/}
            <div
              onClick={handleReplyClick}
              className="interactions-open-panel-content__buttons_button"
            >
              {icons.replyIcon}Ответить
            </div>
            {/* Кнопка Ответить всем*/}
            {data.copy[0] != "" && (
              <div
                onClick={handleReplyClick}
                className="interactions-open-panel-content__buttons_button"
              >
                {icons.replyAllIcon}Ответить всем
              </div>
            )}
            {/* Кнопка переслать*/}
            <div
              onClick={handleForwardClick}
              className="interactions-open-panel-content__buttons_button"
            >
              {icons.forwardIcon}Переслать
            </div>
          </div>
        </span>
      </InteractionField>

      {/* Кому*/}
      <InteractionField label="Кому">
        <span
          className="interactions-open-panel-content__value"
          title={
            Array.isArray(data.fioWhom) ? data.fioWhom.join(", ") : data.fioWhom
          }
        >
          {data.fioWhom}
        </span>
      </InteractionField>

      {/* Копия*/}
      <InteractionField label="Копия">
        <span
          className="interactions-open-panel-content__value"
          title={Array.isArray(data.copy) ? data.copy.join(", ") : data.copy}
        >
          {data.copy}
        </span>
      </InteractionField>

      {/* Дата и время*/}
      <InteractionField label="Дата и время">
        <span
          className="interactions-open-panel-content__value"
          title={data.createdAt}
        >
          {data.createdAt}
        </span>
      </InteractionField>

      {/* Статус*/}
      <InteractionField label="Статус обработки">
        <span
          className="interactions-open-panel-content__status"
          title={data.status.value}
        >
          {getIcon(data.status.code)}
          {data.status.value}
        </span>
      </InteractionField>

      {/* Вложения*/}
      <InteractionField label="Вложение">
        <span className="interactions-open-panel-content__object">
          {data.fileSrc?.[0] && (
            <span className="interactions-open-panel-content__value">
              {data.fileSrc[0].nameFiles}
            </span>
          )}
          {/* Кнопка зависит от количества файлов */}
          {data.fileSrc && data.fileSrc.length > 1 ? (
            <div className="interactions-open-panel-content__buttons_file">
              {/* Кнопка Скачать Все*/}
              <div
                onClick={() => handleSaveAllClick(data.fileSrc)}
                className="interactions-open-panel-content__buttons_button"
              >
                {icons.downloadIcon}Скачать все
              </div>
              {/* Кнопка Показать Все*/}
              <div
                className="show-all-wrapper"
                style={{ position: "relative", display: "inline-block" }}
              >
                <div
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="interactions-open-panel-content__buttons_button"
                >
                  Показать все ({data.fileSrc.length})
                </div>
                {isDropdownOpen && (
                  <FilesDropdown
                    files={data.fileSrc}
                    onDownload={handleSaveClick}
                    onClose={() => setDropdownOpen(false)}
                  />
                )}
              </div>
            </div>
          ) : data.fileSrc?.length === 1 ? (
            <div
              onClick={() => {
                if (data.fileSrc?.[0]) handleSaveClick(data.fileSrc[0]);
              }}
              className="interactions-open-panel-content__buttons_button"
            >
              {icons.downloadIcon}Скачать
            </div>
          ) : null}
        </span>
      </InteractionField>

      {/* Модальное окно */}
      {isModalOpen && (
        <SendEmailModal
          interactionId={data.id}
          closeModal={closeModal}
          mode={modalMode}
          initialData={modalData}
          saveState={saveState}
        />
      )}
    </div>
  );
}

export default InteractionsContent;
