import type { CollectionDetailDto } from "@/types/collection.type";

export type Clock = () => Date;

export type ParsedCollectionOccurrence = {
  occurredAtUtc: Date;
  occurrenceOffset: string;
  occurredAt: string;
};

export type SerializableCollectionDetail = {
  id: string;
  occurredAt: string;
  confirmedAt: Date;
  area: { id: string; name: string };
  laboratory: { id: string; name: string; status: "ACTIVE" | "INACTIVE" };
  readOnly: boolean;
};

export type CollectionTemporalErrorReason = "REQUIRED" | "FORMAT" | "FUTURE";

export class CollectionContractError extends Error {
  constructor(
    public readonly code: "INVALID_REQUEST" | "NOT_IMPLEMENTED",
    public readonly reason?: CollectionTemporalErrorReason,
  ) {
    super(code);
    this.name = "CollectionContractError";
  }
}

const RFC3339 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/;

function invalid(reason: CollectionTemporalErrorReason): never {
  throw new CollectionContractError("INVALID_REQUEST", reason);
}

function daysInMonth(year: number, month: number) {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseCollectionInput(
  value: unknown,
  clock: Clock = () => new Date(),
): ParsedCollectionOccurrence {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return invalid("FORMAT");
  }
  const body = value as Record<string, unknown>;
  if (Object.keys(body).length !== 1 || !("occurredAt" in body)) {
    return invalid("FORMAT");
  }
  if (typeof body.occurredAt !== "string" || body.occurredAt.length === 0) {
    return invalid("REQUIRED");
  }
  const match = RFC3339.exec(body.occurredAt);
  if (!match) return invalid("FORMAT");

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, fraction = "", offset, sign, offsetHourText, offsetMinuteText] = match;
  const [year, month, day, hour, minute, second] =
    [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  if (
    month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month) ||
    hour > 23 || minute > 59 || second > 59
  ) return invalid("FORMAT");

  let offsetMinutes = 0;
  if (offset !== "Z") {
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (
      offset === "-00:00" || offsetHour > 14 || offsetMinute > 59 ||
      (offsetHour === 14 && offsetMinute !== 0)
    ) return invalid("FORMAT");
    offsetMinutes = (sign === "+" ? 1 : -1) * (offsetHour * 60 + offsetMinute);
  }

  const milliseconds = Number(fraction.padEnd(3, "0"));
  const civil = new Date(0);
  civil.setUTCFullYear(year, month - 1, day);
  civil.setUTCHours(hour, minute, second, milliseconds);
  const occurredAtUtc = new Date(civil.getTime() - offsetMinutes * 60_000);
  const current = clock();
  if (!Number.isFinite(current.getTime()) || occurredAtUtc.getTime() > current.getTime()) {
    return invalid("FUTURE");
  }
  const canonicalLocal = `${yearText}-${monthText}-${dayText}T${hourText}:${minuteText}:${secondText}.${fraction.padEnd(3, "0")}${offset}`;
  return { occurredAtUtc, occurrenceOffset: offset, occurredAt: canonicalLocal };
}

export function serializeCollectionDetail(
  value: SerializableCollectionDetail,
): CollectionDetailDto {
  return {
    id: value.id,
    occurredAt: value.occurredAt,
    confirmedAt: value.confirmedAt.toISOString(),
    area: { id: value.area.id, name: value.area.name },
    laboratory: { ...value.laboratory },
    readOnly: value.readOnly,
  };
}

const UUID_PROFILE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseIdempotencyKey(value: string | null): string {
  if (!value || !UUID_PROFILE.test(value)) invalid("FORMAT");
  return value.toLowerCase();
}

export function collectionSuccess(collection: CollectionDetailDto) {
  return { collection };
}

const errorMessages = {
  INVALID_REQUEST: "A solicitação de coleta é inválida.",
  UNAUTHENTICATED: "Autenticação necessária.",
  FORBIDDEN: "Você não possui permissão para esta operação.",
  NOT_FOUND: "Recurso não encontrado.",
  READ_ONLY: "O laboratório está em modo somente leitura.",
  CONFLICT: "A chave de confirmação já foi usada com outros dados.",
  INTERNAL_ERROR: "Não foi possível concluir a operação.",
} as const;

export type CollectionHttpErrorCode = keyof typeof errorMessages;

export function collectionError(code: CollectionHttpErrorCode) {
  return { error: { code, message: errorMessages[code] } };
}
