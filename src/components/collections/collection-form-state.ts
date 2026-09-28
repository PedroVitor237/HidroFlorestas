import type { CollectionAttempt, CollectionContext } from "@/types/collection.type";
import { createClientUuid } from "@/lib/client-uuid";
import {
  CollectionContractError,
  parseCollectionInput,
  type Clock,
} from "@/app/api/server/collections/collection.contracts";

export function createCollectionAttempt(
  context: CollectionContext,
  createKey: () => string = createClientUuid,
): CollectionAttempt {
  return {
    context: {
      laboratory: { ...context.laboratory },
      area: { ...context.area },
      readOnly: context.readOnly,
    },
    occurredAt: "",
    phase: "editing",
    idempotencyKey: createKey(),
    error: null,
  };
}

export function updateCollectionOccurrence(
  attempt: CollectionAttempt,
  occurredAt: string,
): CollectionAttempt {
  return { ...attempt, occurredAt, phase: "editing", error: null };
}

export function reviewCollectionAttempt(
  attempt: CollectionAttempt,
  clock: Clock = () => new Date(),
): CollectionAttempt {
  try {
    parseCollectionInput({ occurredAt: attempt.occurredAt }, clock);
    return { ...attempt, phase: "reviewing", error: null };
  } catch (error) {
    if (error instanceof CollectionContractError) {
      const message = error.reason === "REQUIRED"
        ? "Informe data, horário e fuso explícito."
        : error.reason === "FUTURE"
          ? "A ocorrência não pode estar no futuro."
          : "Use data e horário RFC 3339 com fuso explícito, sem correção automática.";
      return { ...attempt, phase: "editing", error: message };
    }
    throw error;
  }
}

export function editCollectionAttempt(attempt: CollectionAttempt): CollectionAttempt {
  return { ...attempt, phase: "editing", error: null };
}

export function beginCollectionSubmission(attempt: CollectionAttempt): CollectionAttempt {
  if (attempt.phase === "submitting") return attempt;
  if (attempt.phase !== "reviewing") throw new Error("REVIEW_REQUIRED");
  return { ...attempt, phase: "submitting", error: null };
}

export function failCollectionSubmission(
  attempt: CollectionAttempt,
  message: string,
): CollectionAttempt {
  return { ...attempt, phase: "reviewing", error: message };
}

export function startNewCollectionAttempt(
  attempt: CollectionAttempt,
  createKey: () => string = createClientUuid,
): CollectionAttempt {
  return createCollectionAttempt(attempt.context, createKey);
}
