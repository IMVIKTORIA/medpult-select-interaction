import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { SortData } from "../../../../shared/types";
import icons from "../../../../shared/icons";

interface IListHeaderColumnProps extends PropsWithChildren {
  /** Обработчик нажатия на сортировку */
  handleSortClick?: () => void;
  /** Состояние сортировки */
  sortingState?: SortingState;
  /** Тултип */
  tooltip?: string;
}

/** Состояние сортировки */
export enum SortingState {
  /** По возрастанию */
  ascending,
  /** По убыванию */
  descending,
  /** Не сортируется */
  unsorted,
}

/** Контролер сортировки */
function SortButton({ handleSortClick, sortingState }: IListHeaderColumnProps) {
  const isSorted =
    sortingState === SortingState.ascending ||
    sortingState === SortingState.descending;
  const rotation = sortingState === SortingState.descending ? "180deg" : "0deg";

  return (
    <button className="list-header-column__button" onClick={handleSortClick}>
      {isSorted ? (
        <span
          style={{
            transform: `rotate(${rotation})`,
          }}
        >
          {icons.SortArrow}
        </span>
      ) : (
        <span>{icons.SortArrowDefault}</span>
      )}
    </button>
  );
}

/** Столбец шапки списка */
export default function ListHeaderColumn({
  handleSortClick,
  sortingState,
  children,
  tooltip,
}: IListHeaderColumnProps) {
  return (
    <div className="list-header-column">
      <div
        className="list-header-column__title"
        title={tooltip ?? children?.toString()}
      >
        {children}
      </div>
      {handleSortClick !== undefined && sortingState !== undefined ? (
        <SortButton
          handleSortClick={handleSortClick}
          sortingState={sortingState}
        />
      ) : null}
    </div>
  );
}
