import {
  IInteractionItem,
  IInteractionDetailsItem,
  FilesData,
  InteractionStatus,
} from "../../components/SelectInteraction/InteractionsList/InteractionsListTypes";
import { TabsItemsCounts } from "../types";
import { generateRandomInteractionItem } from "./InteractionsListScripts/interactionsGenerator";
import { ObjectItem } from "../../../UIKit/Filters/FiltersTypes";
import interactionsListScripts from "./InteractionsListScripts/InteractionsListScripts";
import { SendEmailAction } from "../../components/SelectInteraction/InteractionsList/SendEmailModal/SendEmailModalTypes";

/** Заглушка ожидания ответа сервера */
function randomDelay() {
  const delay = Math.random() * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/**Обновление взаимодейтсвий взаимодействий */
async function getInteractionById(id: string): Promise<IInteractionItem> {
  await randomDelay();
  const item = generateRandomInteractionItem();
  return {
    ...item,
    id,
  };
}
/** Получение детальных данных взаимодействия */
async function getInteractionsDetails(
  interactionId: string
): Promise<IInteractionDetailsItem> {
  return {
    id: "111",
    number: "VZ00000809/21",
    fioFrom: "Андреев Максим Максимович",
    email: "andreev@mail.ru",
    fioWhom: ["103@sberins.ru"],
    copy: [""],
    createdAt: " 02.08.2025 15:00",
    status: { value: "Новое", code: InteractionStatus.new },
    fileSrc: [
      {
        ...new FilesData(),
        fileDownloadURL:
          "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
        nameFiles: "file1",
      },
      {
        ...new FilesData(),
        fileDownloadURL:
          "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg",
        nameFiles: "file2",
      },
    ],
    group: { value: "Экстренная помощь", code: "fasfas" },
    employee: { value: "", code: "" },
    request: { value: "RQ00000809/21", code: "fasfas" },
    task: { value: " -", code: "" },
    reasonRequest: "Информация о состоянии здоровья",
    descriptionTask:
      " Информация о состоянии здоровья предоставляется пациенту лично",
    topic: "Fw: Запрос согласования",
    text: "Это электронное сообщение и любые документы, приложенные к нему, содержат конфиденциальную информацию. Настоящим уведомляем Вас о том, что если это сообщение не предназначено Вам, использование, копирование, распространение информации, содержащейся в настоящем сообщении, а также осуществление любых действий на основе этой информации, строго запрещено.",
  };
}

/** Получить количество дублей взаимодействий */
//Если дублей нет возращать просто return null, если есть то кол-во
async function getInteractionsDublicateCount(data?: IInteractionDetailsItem) {
  return null;
}

/** Нажатие на кнопку "Взять в работу" */
async function setStatusAtWork(interactionId: string | undefined) {
  return;
}
/** Нажатие на кнопку "Закрыть" */
async function setStatusProcessed(interactionId: string | undefined) {
  return;
}

/** Получение каналов */
async function getChannels(): Promise<ObjectItem[]> {
  await randomDelay();
  const channels: ObjectItem[] = [
    new ObjectItem({ code: "test", value: "Телефон" }),
    new ObjectItem({ code: "test1", value: "Email" }),
    new ObjectItem({ code: "test4", value: "СМС" }),
  ];
  return channels;
}
/** Получение линий */
async function getLines(channels?: string[]): Promise<ObjectItem[]> {
  await randomDelay();
  const lines: ObjectItem[] = [
    new ObjectItem({ code: "test1", value: "103@sberins.ru" }),
    new ObjectItem({ code: "test2", value: "911@sberins.ru" }),
    new ObjectItem({ code: "test3", value: "dms.kurators@sberins.ru" }),
    new ObjectItem({ code: "test4", value: "104@sberins.ru" }),
    new ObjectItem({ code: "test5", value: "912@sberins.ru" }),
    new ObjectItem({ code: "test6", value: "oms.kurators@sberins.ru" }),
  ];
  return lines;
}

/** Получение статусов взаимодействий */
async function getStatuses(): Promise<ObjectItem[]> {
  await randomDelay();
  /** Статусы */
  const statuses: ObjectItem[] = [
    new ObjectItem({ code: "test1", value: "Новое" }),
    new ObjectItem({ code: "test2", value: "В очереди" }),
    new ObjectItem({ code: "test3", value: "В работе" }),
  ];
  return statuses;
}
/** Получение Email  */
async function getEmails(): Promise<ObjectItem[]> {
  await randomDelay();
  const emails: ObjectItem[] = [
    new ObjectItem({ code: "test", value: "Телефон" }),
    new ObjectItem({ code: "test1", value: "Email (103@sberins.ru)" }),
  ];
  return emails;
}
/** Получение групп */
async function getUserGroups(users?: string[]): Promise<ObjectItem[]> {
  await randomDelay();

  const authors: ObjectItem[] = [
    new ObjectItem({ code: "test", value: "Группа записи" }),
    new ObjectItem({ code: "test1", value: "Врачи кураторы МедКЦ (3 линия)" }),
    new ObjectItem({ code: "test2", value: "Операторы (дев)" }),
    new ObjectItem({ code: "test3", value: "Врачи кураторы МедКЦ (2 линия)" }),
    new ObjectItem({ code: "test4", value: "Супервайзеры (дев)" }),
    new ObjectItem({ code: "test5", value: "Экперты по претензиям (4 линия)" }),
  ];

  return authors;
}
/** Получение исполнителей */
async function getUsersInteraction(groups?: string[]): Promise<ObjectItem[]> {
  await randomDelay();

  let authors: ObjectItem[] = [];

  if (groups && groups.length > 0) {
    authors = [
      new ObjectItem({ code: "test", value: "Иванов Иван Иванович" }),
      new ObjectItem({ code: "test1", value: "Петров Петр Петрович" }),
    ];
  } else {
    authors = [
      new ObjectItem({ code: "test", value: "Иванов Иван Иванович" }),
      new ObjectItem({ code: "test1", value: "Петров Петр Петрович" }),
      new ObjectItem({ code: "test2", value: "Сидоров Сидр Сидрович" }),
      new ObjectItem({ code: "test3", value: "Васильев Василий Васильевич" }),
      new ObjectItem({ code: "test4", value: "Иванов Олег Михайлович" }),
      new ObjectItem({ code: "test5", value: "Петрова Ольга Ивановна" }),
    ];
  }

  return authors;
}

/** Сохранить группу и пользователя */
async function saveGroupExecutor(
  interactionId: string | undefined,
  group: ObjectItem | null,
  employee?: ObjectItem | null
): Promise<void> {
  // TODO
  await randomDelay();
}

/** Скачать файл из внешней системы */
async function downloadFileBucket(
  url: string,
  fileName: string
): Promise<{ arrayBuffer: ArrayBuffer; contentType: string }> {
  // TODO
  const file = await fetch(url);

  return {
    arrayBuffer: await file.arrayBuffer(),
    contentType: file.headers.get("content-type") ?? "application/octet-stream",
  };
}

/** Получение пути на страницу обращения */
function getRequestPagePath() {
  return "request";
}

/** Получение id обращения по id задачи */
async function getRequestIdByTaskId(appealId: string): Promise<string> {
  return "test";
}

/** Получение ссылки для перехода на страницу входящего email */
function getIcomingEmailLink(): string {
  return "";
}
/** Получить ссылку формы отбора контрагентов */
function getSelectContractorLink(): string {
  return "#selectRequestTest";
}

async function isCurrentUserExecutor(interactionId: string): Promise<boolean> {
  return true;
}

async function getEmailDataByInteractionId(
  interactionId: string
): Promise<SendEmailAction> {
  return {
    session: { value: "11", code: "11" },
    topic: "22",
    text: "33",
    filesData: [],
    contractor: {
      id: "",
      fullname: "",
      emails: ["dgdfdgrg", "frrres"],
      email: "dgdfdgrg",
    },
    emailsCopy: "ffdffd",
  };
}

/** Получение данных контрагента по его идентификатору */
async function getEmailDataByContractorId(
  contractorId: string
): Promise<SendEmailAction> {
  return {
    contractor: {
      id: "contractorId",
      fullname: "Иванов Иван",
      emails: ["foo@gmail.com", "bar@gmail.com"],
      email: "foo@gmail.com",
    },
  };
}

async function sendEmail(
  email: string,
  emailsCopy: string,
  text: string,
  recipientId: string,
  files: any,
  lineId?: string,
  sessionId?: string,
  topic?: string
): Promise<string | undefined> {
  return;
}

async function validateEmployeeForGroup(
  groupId: string,
  userId: string
): Promise<boolean> {
  return false;
}

export default {
  getInteractionById,
  getInteractionsDetails,
  getInteractionsDublicateCount,
  setStatusAtWork,
  setStatusProcessed,

  getChannels,
  getLines,
  getStatuses,
  getEmails,
  getUserGroups,
  getUsersInteraction,
  saveGroupExecutor,
  downloadFileBucket,

  getRequestPagePath,
  getRequestIdByTaskId,
  getIcomingEmailLink,
  getSelectContractorLink,

  isCurrentUserExecutor,
  validateEmployeeForGroup,
  getEmailDataByInteractionId,
  getEmailDataByContractorId,
  sendEmail,

  ...interactionsListScripts,
};
