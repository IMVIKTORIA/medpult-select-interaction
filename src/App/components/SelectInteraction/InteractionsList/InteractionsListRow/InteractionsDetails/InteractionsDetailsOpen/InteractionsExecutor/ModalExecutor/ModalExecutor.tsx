import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper/ModalWrapper";
import icons from "../../../../../icons";
import ButtonModal from "./ButtonModal/ButtonModal";
import { SearchableSelect } from "./SearchableSelect/SearchableSelect";
import Scripts from "../../../../../../../../shared/utils/clientScripts";
import { ObjectItem } from "../../../../../../../../../UIKit/Filters/FiltersTypes";
import { IObjectData } from "../../../../../InteractionsListTypes";

interface ModalExecutorProps {
  interactionId: string;
  closeModal: () => void;
  initialGroup: IObjectData | null;
  initialEmployee: IObjectData | null;
  onSave?: () => void;
}

const toIObjectData = (item: ObjectItem): IObjectData => ({
  name: item.value,
  code: item.code,
});

/** Модальное окно исполнителя */
export default function ModalExecutor({
  interactionId,
  closeModal,
  initialGroup,
  initialEmployee,
  onSave,
}: ModalExecutorProps) {
  const [group, setGroup] = useState<IObjectData | null>(initialGroup);
  const [employee, setEmployee] = useState<IObjectData | null>(initialEmployee);

  const saveGroupExecutor = async () => {
    await Scripts.saveGroupExecutor(interactionId, group, employee);
    onSave?.();
    closeModal();
  };

  return (
    <ModalWrapper>
      <div className="modal-executor">
        <div className="modal-executor__content">
          <div className="modal-executor__content__header">
            <span className="modal-executor__content__header_title">
              Исполнитель
            </span>
            <span onClick={closeModal} style={{ cursor: "pointer" }}>
              {icons.closeIcon}
            </span>
          </div>
          <div className="modal-executor__content__input">
            <SearchableSelect
              label="Группа"
              placeholder="Введите название группы"
              value={group}
              onSelect={setGroup}
              getDataHandler={async () => {
                const data = await Scripts.getUserGroups(
                  employee ? [employee.code] : []
                );
                return data.map(toIObjectData);
              }}
            />

            <SearchableSelect
              label="Сотрудник"
              placeholder="Введите ФИО сотрудника"
              value={employee}
              onSelect={setEmployee}
              getDataHandler={async () => {
                const data = await Scripts.getUsersInteraction(
                  group ? [group.code] : []
                );
                return data.map(toIObjectData);
              }}
            />
          </div>

          <div className="modal-executor__content__button">
            <ButtonModal
              title="Отменить"
              buttonType="outline"
              clickHandler={closeModal}
              style={{ width: "194px" }}
            />
            <ButtonModal
              title="Сохранить"
              clickHandler={saveGroupExecutor}
              style={{ width: "194px" }}
              disabled={!group?.code}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
