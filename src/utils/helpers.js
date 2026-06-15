export const TODAY    = new Date();
export const pad      = n => String(n).padStart(2, "0");
export const todayStr = `${TODAY.getFullYear()}-${pad(TODAY.getMonth()+1)}-${pad(TODAY.getDate())}`;
