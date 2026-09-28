/** Preserves an unexpected database error so the failed migration can be diagnosed. */
export async function expectImp006Sqlstate(
  scenario: string,
  expectedCode: string,
  action: () => Promise<unknown>,
): Promise<void> {
  let failure: unknown;
  try {
    await action();
  } catch (error) {
    failure = error;
  }
  if (failure === undefined) throw new Error(`${scenario}: operation unexpectedly succeeded`);
  const code = failure && typeof failure === "object" && "code" in failure
    ? String(failure.code)
    : "missing";
  if (code !== expectedCode) {
    throw new Error(`${scenario}: expected SQLSTATE ${expectedCode}, received ${code}`, { cause: failure });
  }
}
