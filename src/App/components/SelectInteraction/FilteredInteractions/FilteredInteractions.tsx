import React, { useEffect, useState, useCallback } from "react";
import Scripts from "../../../shared/utils/clientScripts.ts";
import { ISearchInteractionsParams } from "../InteractionsList/InteractionsListTypes.ts";
import { ObjectItem } from "../../../../UIKit/Filters/FiltersTypes.ts";
import { useEnterClickHandler } from "../../../shared/hooks.ts";
import FiltersWrapper from "../../../../UIKit/Filters/FiltersWrapper/FiltersWrapper.tsx";
import FilterItemString from "../../../../UIKit/Filters/FilterItems/FilterItemString/FilterItemString.tsx";
import FilterItemDate from "../../../../UIKit/Filters/FilterItems/FilterItemDates/FilterItemDates.tsx";
import FilterItemCategory from "../../../../UIKit/Filters/FilterItems/FilterItemCategory/FilterItemCategory.tsx";
import FilterItemCategorySearch from "../../../../UIKit/Filters/FilterItems/FilterItemCategorySearch/FilterItemCategorySearch.tsx";
import CustomInputCheckbox from "../../../../UIKit/CustomInputCheckbox/CustomInputCheckbox.tsx";

interface FilteredInteractionsProps {
  filters: ISearchInteractionsParams;
  setFilters: React.Dispatch<React.SetStateAction<ISearchInteractionsParams>>;
  clickFilterHandler?: () => void;
  setSearchParams: (filters: ISearchInteractionsParams) => void;
  clearSearch?: () => void;
}
export default function FilteredInteractions({
  clickFilterHandler,
  setSearchParams,
  filters,
  setFilters,
  clearSearch,
}: FilteredInteractionsProps) {
  /** Очистка всех фильтров */
  const clearFilters = () => {
    const empty = {};
    setFilters({});
    setLineSearch("");
    setGroupSearch("");
    setUserSearch("");
    setPhoneError("");

    setSearchParams(empty);

    if (clearSearch) {
      clearSearch();
    }
  };

  /** Применить все фильтры */
  const applyFilters = async () => {
    if (!validatePhone(filters.phone || "")) {
      setPhoneError("Введен некорректный номер");
      return;
    }
    setPhoneError("");
    setSearchParams(filters);
  };

  useEnterClickHandler(filters, applyFilters);

  /** Каналы */
  const [channels, setChannels] = useState<ObjectItem[]>([]);
  /** Статусы */
  const [statuses, setStatuses] = useState<ObjectItem[]>([]);
  /** Линии */
  const [lines, setLines] = useState<ObjectItem[]>([]);
  /** Email */
  const [emails, setEmails] = useState<ObjectItem[]>([]);
  /** Группы */
  const [usersGroup, setUsersGroup] = useState<ObjectItem[]>([]);
  /** Исполнители */
  const [users, setUsers] = useState<ObjectItem[]>([]);
  //Получение каналов
  useEffect(() => {
    Scripts.getChannels().then(setChannels);
    Scripts.getStatuses().then(setStatuses);
    Scripts.getLines().then(setLines);
    Scripts.getEmails().then(setEmails);
    //Scripts.getUserGroups().then(setUsersGroup);
    //Scripts.getUsersInteraction().then(setUsers);
  }, []);

  // Обновление пользователей при изменении выбранных групп
  useEffect(() => {
    const selectedGroupCodes = (filters.groups || []).map((g) => g.code);
    Scripts.getUsersInteraction(selectedGroupCodes).then(setUsers);
  }, [filters.groups]);

  // Обновление групп при изменении выбранных пользователей
  useEffect(() => {
    const selectedUserCodes = (filters.users || []).map((u) => u.code);
    Scripts.getUserGroups(selectedUserCodes).then(setUsersGroup);
  }, [filters.users]);

  const [lineSearch, setLineSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Состояние ошибки телефона
  const [phoneError, setPhoneError] = useState("");
  /** Проверка телефона на корректность */
  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 11) {
      return false;
    }
    return true;
  };

  return (
    <div className="filtered-interactions">
      <div className="filtered-interactions__search">
        <FiltersWrapper
          searchHandler={applyFilters}
          resetHandler={clearFilters}
          clickFilterHandler={clickFilterHandler}
        >
          <FilterItemString
            title="Номер взаимодействия"
            value={filters.number || ""}
            onChange={(val) => setFilters((prev) => ({ ...prev, number: val }))}
          />
          <FilterItemString
            title="Телефон"
            value={filters.phone || ""}
            onChange={(val) => setFilters((prev) => ({ ...prev, phone: val }))}
            isPhone={true}
            error={phoneError}
          />
          <FilterItemString
            title="Email"
            value={filters.emailStr || ""}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, emailStr: val }))
            }
          />
          <FilterItemString
            title="Контрагент"
            value={filters.contractor || ""}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, contractor: val }))
            }
          />
          <FilterItemString
            title="Тема обращения"
            value={filters.topic || ""}
            onChange={(val) => setFilters((prev) => ({ ...prev, topic: val }))}
          />
          <CustomInputCheckbox
            title="C вложением"
            checked={filters.hasAttachment || false}
            setValue={(value) => {
              setFilters((prev) => ({ ...prev, hasAttachment: value }));
            }}
          />
          <FilterItemCategory
            title="Статус взаимодействия"
            variants={statuses}
            filterValue={filters.statusInteraction || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, statusInteraction: val }))
            }
          />
          <FilterItemDate
            title="Дата взаимодействия"
            valueFrom={filters.dateFrom}
            valueTo={filters.dateTo}
            timeFrom={filters.timeFrom}
            timeTo={filters.timeTo}
            onChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                ...val,
              }))
            }
          />

          <FilterItemCategory
            title="Канал"
            variants={channels}
            filterValue={filters.channels || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, channels: val }))
            }
          />

          <FilterItemCategorySearch
            title="Линия"
            variants={lines}
            filterValue={filters.lines || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, lines: val }))
            }
            searchValue={lineSearch}
            setSearchValue={setLineSearch}
          />

          <FilterItemCategory
            title="Email"
            variants={emails}
            filterValue={filters.email || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, email: val }))
            }
          />
          <FilterItemCategorySearch
            title="Группа"
            variants={usersGroup}
            filterValue={filters.groups || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, groups: val }))
            }
            searchValue={groupSearch}
            setSearchValue={setGroupSearch}
            enableSelectAll
          />
          <FilterItemCategorySearch
            title="Сотрудник"
            variants={users}
            filterValue={filters.users || []}
            setFilterValue={(val) =>
              setFilters((prev) => ({ ...prev, users: val }))
            }
            searchValue={userSearch}
            setSearchValue={setUserSearch}
            enableSelectAll
          />
        </FiltersWrapper>
      </div>
    </div>
  );
}
