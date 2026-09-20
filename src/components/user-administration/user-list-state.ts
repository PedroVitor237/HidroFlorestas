export function adminUserQuery(filters: { search: string; role: string; status: string; cursor?: string }) {
  const query = new URLSearchParams({ limit: "25" });
  if (filters.search.trim()) query.set("search", filters.search.trim());
  if (filters.role) query.set("role", filters.role);
  if (filters.status) query.set("status", filters.status);
  if (filters.cursor) query.set("cursor", filters.cursor);
  return query;
}

export function mergeUniquePage<T extends { id: string }>(current: T[], next: T[]) {
  const items = new Map(current.map((item) => [item.id, item]));
  for (const item of next) items.set(item.id, item);
  return [...items.values()];
}
