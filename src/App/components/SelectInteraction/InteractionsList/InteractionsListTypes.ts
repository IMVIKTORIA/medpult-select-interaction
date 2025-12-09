import { ObjectItem } from "../../../../UIKit/Filters/FiltersTypes";

/** Статус взаимодействия */
export enum InteractionStatus {
  /** Новое*/
  new = "new",
  /**В очереди*/
  queue = "queue",
  /**В работе */
  atWork = "atWork",
  /** Обработано */
  processed = "processed",
  /** Пропущено */
  missed = "missed",
}

/** Тип канала поступления */
export enum ChannelType {
  /** Электронная почта */
  email = "email",
  /** Звонок */
  call = "call",
  /** СМС */
  sms = "sms",
  /** Ручной ввод */
  manual = "manual",
}

export enum SlaStatus {
  /** Нормально */
  ok,
  /** Срок подходит к концу */
  warning,
  /** Просрочено */
  overdue,
}

/** Коды сортируемых колонок взаимодействий */
export enum InteractionsSortableFieldCode {
  /** Дата создания */
  createdAt = "createdAt",
  /** Контрагент */
  contractor = "contractor",
  /** Ипсолнитель */
  executor = "executor",
}

/** Данные точки входа */
export interface IEntryPoint {
  /** Вид канала поступления */
  channelSort: string;
  /** Маркетинговое название ящика */
  marketingName: string;
}

/** Данные исполнителя */
export interface IExecutorData {
  /** ФИО исполнителя */
  fullname: string;
  /** Группа исполнителя */
  groupName: string;
}
/** Данные даты */
export interface IDateData {
  /**Дата */
  date: string;
  /** Длительность звонка */
  duration: string;
}

/** Элемент списка взаимодействий */
export interface IInteractionItem {
  /** Идентификатор Взаимодействия */
  id: string;
  /** Статус */
  status: InteractionStatus;
  /** Тип канала поступления */
  channelType: ChannelType;
  /** Является входящим */
  isIncoming: boolean;
  /** Точка входа */
  entryPoint: IEntryPoint;
  /** IVR */
  ivr?: string;
  /** SLA */
  slaStatus?: SlaStatus;
  /** Контактные данные (Телефон / Email) */
  contactData: string;
  /** Дата и время */
  createdAt: IDateData;
  /** Номер взаимодействия */
  number: string;
  /** Контрагент */
  contractorName: string | undefined;
  /** Имеются вложения? */
  hasAttachments: boolean;
  /** Тема обращения */
  requestTopic: string;
  /** Обращение */
  request: ObjectItem | undefined;
  /** Задача */
  task: ObjectItem | undefined;
  /** Задача */
  executor: IExecutorData | undefined;
}

/** Данные вложений */
export class FilesData {
  /** Идентификатор файла */
  id: string;
  /** Ссылка на скачивание файла */
  fileDownloadURL: string;
  /** Название файла */
  nameFiles: string;

  constructor() {
    this.id = "";
    this.fileDownloadURL = "";
    this.nameFiles = "";
  }
}

/** Детальные данные взаимодействий */
export interface IInteractionDetailsItem {
  /** id */
  id: string;
  /** Дата */
  number: string;
  /** От кого */
  fioFrom: string;
  /** email */
  email: string;
  /** Кому */
  fioWhom: string[];
  /** Копия */
  copy: string[];
  /** Дата создания */
  createdAt: string;
  /** Статус взаимодействия */
  status: ObjectItem;
  /** Вложения */
  fileSrc?: FilesData[];
  /** Группа */
  group?: ObjectItem;
  /** Сотрудник */
  employee?: ObjectItem;
  /** Номер обращения */
  request?: ObjectItem;
  /** Номер задачи */
  task?: ObjectItem;
  /** Причина обращения */
  reasonRequest: string;
  /** Описание задачи */
  descriptionTask: string;
  /** Тема */
  topic: string;
  /** Текст письма */
  text: string;
  /** Входящее? */
  isIncoming: boolean
}

/** Параметры поиска Взаимодействий */
export interface ISearchInteractionsParams {
  /** Номер взаимодействия */
  number?: string;
  /**Телефон */
  phone?: string;
  /** Email строковое */
  emailStr?: string;
  /** Контрагент */
  contractor?: string;
  /** Тема обращения */
  topic?: string;
  /** Есть вложение? */
  hasAttachment?: boolean;
  /** Статус взаимодействия */
  statusInteraction?: ObjectItem[];
  /** Дата создания */
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  /** Канал */
  channels?: ObjectItem[];
  /** Точка входа */
  lines?: ObjectItem[];
  /** Email */
  email?: ObjectItem[];
  /** Статус обработки */
  statuses?: ObjectItem[];
  /** Группа */
  groups?: ObjectItem[];
  /** Сотрудник */
  users?: ObjectItem[];
}
