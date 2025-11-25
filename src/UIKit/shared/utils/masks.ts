/** Маски для полей ввода */

/** Маска дат */
const applyDateMask = (value: string): string => {
  const match = value.match(/(\d{1,2})?\D*(\d{1,2})?\D*(\d{1,4})?/m)?.slice(1);
  if (!match) return "";

  if (Number(match[1]) > 12) match[1] = "12";
  if (match[1]?.length == 2 && Number(match[1]) < 1) match[1] = "01";

  if (match[2]?.length == 4) {
    const lastDayOfMonth = new Date(
      Number(match[2]),
      Number(match[1]),
      0
    ).getDate();

    if (match[1]?.length == 2) {
      if (Number(match[0]) > lastDayOfMonth)
        match[0] = lastDayOfMonth.toString();
      if (match[0]?.length == 2 && Number(match[0]) < 1) match[0] = "01";
    }
  }

  value = match.filter((val) => val).join(".") ?? "";
  return value;
};

/** Маска чисел с плавающей точкой */
export const applyNumbersMask = (value: string): string => {
  return (
    value
      .match(/\d+[,|\.]?\d*/g)
      ?.join("")
      .replace(".", ",") ?? ""
  );
};

/** Маска телефонов */
export const applyPhoneMask = (value: string): string => {
  let valueEdited = value;
  if (valueEdited[0] == "9") valueEdited = "7" + valueEdited;
  valueEdited =
    Array.from(
      valueEdited.matchAll(
        /(\+?7|8)\D*(\d{1,3})?\D*(\d{1,3})?\D*(\d{1,2})?\D*(\d{1,2})?/gm
      )
    )[0]
      ?.slice(1)
      .filter((val) => val)
      .join(" ")
      .replace(/^(7|8)/, "+7") ?? "";
  return valueEdited;
};

export const applyTimeMask = (value: string) => {
  let v = value.replace(/\D/g, "").slice(0, 4);

  if (v.length === 0) return "";
  if (v.length === 1) return v[0]; // первая цифра часов
  if (v.length === 2) {
    // проверяем часы
    if (parseInt(v, 10) > 23) return "23";
    return v;
  }
  if (v.length === 3) return v.slice(0, 2) + ":" + v[2];
  if (v.length === 4) {
    let hh = parseInt(v.slice(0, 2), 10);
    if (hh > 23) hh = 23;
    let mm = parseInt(v.slice(2), 10);
    if (mm > 59) mm = 59;
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  }

  return v;
};

//Парсинг даты + времени
export const parseToDate = (date?: string, time?: string): Date | null => {
  if (!date) return null;
  const [d, m, y] = date.split(".").map(Number);
  if (!d || !m || !y) return null;

  let hh = 0;
  let mm = 0;
  if (time && /^\d{2}:\d{2}$/.test(time)) {
    [hh, mm] = time.split(":").map(Number);
  }

  return new Date(y, m - 1, d, hh, mm);
};

export default {
  applyDateMask,
  applyNumbersMask,
  applyTimeMask,
};
