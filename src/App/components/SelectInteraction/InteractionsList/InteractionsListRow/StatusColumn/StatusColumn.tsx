import React, { useEffect, useState } from "react";
import { InteractionStatus } from "../../InteractionsListTypes";
import Scripts from "../../../../../shared/utils/clientScripts";
import icons from "../../icons";
type StatusColumnProps = {
  /** Статус */
  status: InteractionStatus;
};

/** Колонка статуса взаимодействия */
export default function StatusColumn({ status }: StatusColumnProps) {
  const getStatusIconColor = () => {
    switch (status) {
      case InteractionStatus.new:
        return icons.InteracrionNew;
      case InteractionStatus.atWork:
        return icons.InteracrionAtWork;
      case InteractionStatus.processed:
        return icons.InteracrionProcessed;
      case InteractionStatus.missed:
        return icons.InteracrionMissed;
      default:
        return icons.InteracrionQueue;
    }
  };

  const statusName = Scripts.getInteractionStatusName(status);

  return (
    <div className="status-column" title={statusName}>
      {getStatusIconColor()}
    </div>
  );
}
