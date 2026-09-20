const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };

export function ihfrJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers });
}

export function ihfrNotImplemented() {
  return ihfrJson({ error: { code: "NOT_IMPLEMENTED", message: "IHFR diagnosis route is not implemented" } }, 501);
}
