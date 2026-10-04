/** Explicit local test context; account work never inherits the juniors' cluster. */
export function localPostgresqlContext(env: Record<string, string | undefined> = process.env) {
  const accounts = env.ACCOUNTS_LOCAL_POSTGRESQL === "1";
  if (env.ACCOUNTS_LOCAL_POSTGRESQL !== undefined && !accounts) throw new Error("Invalid accounts PostgreSQL opt-in");
  return accounts ? {
    accounts: true, directory: "accounts-postgresql", port: "55427", owner: "accounts_owner",
    clusterMarker: "hidroflorestas:accounts-local-postgresql:v1", regressionMarker: "hidroflorestas:accounts-regression:v1",
    testDatabase: "accounts_regression_test", referenceDatabase: "accounts_regression_reference",
  } as const : {
    accounts: false, directory: "imp006-postgresql", port: "55426", owner: "imp006_owner",
    clusterMarker: "hidroflorestas:imp006-local-postgresql:v1", regressionMarker: "hidroflorestas:imp006-regression:v2",
    testDatabase: "imp006_regression_v2_test", referenceDatabase: "imp006_regression_v2_reference",
  } as const;
}
