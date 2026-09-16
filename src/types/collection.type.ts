export type CollectionContext = {
  laboratory: { id: string; name: string; status: "ACTIVE" | "INACTIVE" };
  area: { id: string; name: string };
  readOnly: boolean;
};

export type CollectionOccurrenceInput = { occurredAt: string };

export type CollectionTemporalProjection = {
  occurredAt: string;
  occurredAtUtc: Date;
  occurrenceOffset: string;
};

export type CollectionAttemptError =
  | "OCCURRENCE_REQUIRED"
  | "OCCURRENCE_FORMAT"
  | "OCCURRENCE_FUTURE";

export type CollectionAttempt = {
  context: CollectionContext;
  occurredAt: string;
  phase: "editing" | "reviewing" | "submitting";
  idempotencyKey: string;
  error: string | null;
};

export type CollectionDetailDto = {
  id: string;
  occurredAt: string;
  confirmedAt: string;
  area: { id: string; name: string };
  laboratory: { id: string; name: string; status: "ACTIVE" | "INACTIVE" };
  readOnly: boolean;
};
