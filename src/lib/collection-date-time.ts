import { parseCollectionInput } from "@/app/api/server/collections/collection.contracts";

const pad = (value: number, size = 2) => String(value).padStart(size, "0");

export function deviceLocalDateTime(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

export function deviceUtcOffset(date: Date): string {
  const minutes = -date.getTimezoneOffset();
  const absolute = Math.abs(minutes);
  return `${minutes < 0 ? "-" : "+"}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
}

export function localOccurrenceToRfc3339(local: string, offset: string): string {
  if (!local) return "";
  // Native controls may omit zero seconds. Never attach Z to civil time.
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local) ? `${local}:00` : local;
  return `${withSeconds}${offset}`;
}

export function deviceOffsetForLocal(local: string): string {
  const date = new Date(local);
  const offset = deviceUtcOffset(date);
  const value = localOccurrenceToRfc3339(local, offset);
  // Shared calendar/offset validation, with future checked separately at review.
  const parsed = parseCollectionInput({ occurredAt: value }, () => new Date(8.64e15));
  if (!Number.isFinite(date.getTime()) || deviceLocalDateTime(date) !== parsed.occurredAt.slice(0, -6)) {
    throw new Error("Esse horário não existe no fuso do dispositivo. Corrija a data/hora ou informe um fuso UTC manual.");
  }
  // A repeated civil hour needs an explicit offset instead of Date's implicit choice.
  const nearbyOffsets = new Set([-1, 1].map(day => new Date(date.getTime() + day * 86_400_000).getTimezoneOffset()));
  for (const otherOffset of nearbyOffsets) {
    const candidate = new Date(date.getTime() + (otherOffset - date.getTimezoneOffset()) * 60_000);
    if (candidate.getTime() !== date.getTime() && deviceLocalDateTime(candidate) === deviceLocalDateTime(date)) {
      throw new Error("Esse horário ocorre duas vezes no fuso do dispositivo. Selecione Fuso UTC manual e confirme o offset da coleta.");
    }
  }
  return offset;
}

/** Preserve the declared offset even when the viewer/server uses another zone. */
export function formatCollectionOccurrence(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}:\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day, time, fraction = "", offset] = match;
  return `${day}/${month}/${year} ${time}${fraction && fraction !== ".000" ? fraction : ""} (UTC${offset === "Z" ? "+00:00" : offset})`;
}
