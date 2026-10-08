import { deletionHandlers } from "../../server/accounts/deletion.http";
export const runtime = "nodejs";
export const GET = deletionHandlers.GET;
export const DELETE = deletionHandlers.DELETE;
