export const parseMonth = (date: Date) =>
  date.toLocaleString("default", { month: "long" });
