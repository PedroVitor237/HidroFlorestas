export function matchesImp006Schema(rows: readonly { schema: unknown }[], expected: string): boolean {
  return /^imp006_test_[0-9a-f]{32}$/.test(expected) && rows.length === 1 && rows[0]?.schema === expected;
}
