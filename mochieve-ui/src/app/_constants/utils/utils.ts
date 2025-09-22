import { DateTime } from "luxon";

export const encodeDatetime = (dateTimeString: string): string => {
  const dt = DateTime.fromISO(dateTimeString, { zone: 'utc' }).setZone('Asia/Tokyo');
  return dt.toFormat("yyyy/MM/dd HH:mm:ss");
}