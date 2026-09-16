import type { CollectionAttempt, CollectionContext } from "@/types/collection.type";
import {
  CollectionContractError,
  parseCollectionInput,
  type Clock,
} from "@/app/api/server/collections/collection.contracts";

export function createCollectionAttempt(
  context: CollectionContext,
  createKey: () => string = () => crypto.randomUUID(),
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
