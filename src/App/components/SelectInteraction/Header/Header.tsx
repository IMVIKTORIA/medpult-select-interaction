import React, { PropsWithChildren, useState } from "react";
import icons from "../InteractionsList/icons";

interface HeaderProps {
  /** Заголовок */
  title: string;
  /** Статус телефонии */
  status: { name: string; code: string };
}

/** Шапка страницы */
function Header({ title, status, children }: PropsWithChildren<HeaderProps>) {
  const getStatusIcon = () => {
    switch (status.code) {
      case "done":
        return icons.InteracrionProcessed;
      case "process":
        return icons.InteracrionMissed;
      default:
        return icons.InteracrionQueue;
    }
  };

  return (
    <div className="header">
      <div className="header__title">{title}</div>
      {/* <div className="header__status">
        {getStatusIcon()}
        {status.name}
        {icons.arrowGreyIcon}
      </div> */}
    </div>
  );
}

export default Header;
