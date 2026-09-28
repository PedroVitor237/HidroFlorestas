import type { PublicDiagnosis } from "@/types/ihfr-diagnosis.type";

export type IHFRClock = { now(): Date };
export type IHFRTransaction = { run<T>(work: (store: IHFRDiagnosisStore) => Promise<T>): Promise<T> };
export interface IHFRDiagnosisStore {
  findCurrent(collectionId: string): Promise<PublicDiagnosis | null>;
  findDiagnosis(collectionId: string, diagnosisId: string): Promise<PublicDiagnosis | null>;
}
