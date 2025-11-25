import React, { PropsWithChildren, useState } from "react";
import Button from "../../Button/Button";
import { ButtonType } from "../../Button/ButtonTypes";
import icons from "../../shared/icons";

interface FiltersWrapperProps {
  resetHandler?: () => void;
  searchHandler?: () => Promise<void>;
  isSearchButtonDisabled?: boolean;
  clickFilterHandler?: () => void;
}

/** Обертка панели фильтров */
export default function FiltersWrapper({
  searchHandler,
  resetHandler,
  children,
  isSearchButtonDisabled,
  clickFilterHandler,
}: PropsWithChildren<FiltersWrapperProps>) {
  // Показывать ошибку "Фильтр не выбран"?
  const [isShowEmptyFiltersError, setIsShowEmptyFiltersError] =
    useState<boolean>(false);

  return (
    <div className="filters-wrapper">
      <div className="filters-wrapper__buttons">
        <div className="filters-wrapper__buttons_search-button">
          <Button
            title={"Применить"}
            clickHandler={searchHandler}
            disabled={isSearchButtonDisabled}
          />
          {isShowEmptyFiltersError && (
            <div className="filters-wrapper__error-message">
              Фильтр не выбран
            </div>
          )}
        </div>
        <Button
          title={"Очистить все"}
          buttonType={ButtonType.outline}
          clickHandler={resetHandler}
        />
      </div>
      <div className="filters-wrapper__filter">
        <Button
          title={icons.FilterButton}
          clickHandler={clickFilterHandler}
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      <div className="filters-wrapper__list">{children}</div>
    </div>
  );
}
