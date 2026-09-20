import { createHash } from "node:crypto";

export const USER_ROLES = ["USER", "ADMIN", "DEVELOPER", "MODERATOR"] as const;
export const USER_STATUSES = ["ACTIVE", "INACTIVE", "PENDING", "BLOCKED"] as const;
export type AdminUserRole = (typeof USER_ROLES)[number];
export type AdminUserStatus = (typeof USER_STATUSES)[number];

export type AdminUserDto = {
  id: string; firstName: string; lastName: string; email: string;
  role: AdminUserRole; status: AdminUserStatus; revision: number;
  createdAt: string; updatedAt: string;
};
export type AuditEventDto = {
  id: string; targetUserId: string; actorUserId: string;
  action: "ACCOUNT_STATUS_CHANGED" | "GLOBAL_ROLE_CHANGED";
  beforeValue: AdminUserRole | AdminUserStatus; afterValue: AdminUserRole | AdminUserStatus;
  reason: string; targetRevision: number; createdAt: string;
};
export type AdminListQuery = { search: string; role?: AdminUserRole; status?: AdminUserStatus; limit: number; cursor?: string };
export type StatusChangeInput = { expectedStatus: AdminUserStatus; expectedRevision: number; status: AdminUserStatus; reason: string };
export type RoleChangeInput = { expectedRole: AdminUserRole; expectedRevision: number; role: AdminUserRole; reason: string };

export type UserAdministrationErrorCode =
  | "INVALID_INPUT" | "INVALID_FILTER" | "INVALID_CURSOR" | "CURSOR_FILTER_MISMATCH" | "INVALID_REASON"
  | "UNAUTHENTICATED" | "ADMIN_AUTHORITY_REQUIRED" | "SELF_CHANGE_FORBIDDEN" | "USER_NOT_FOUND"
  | "STALE_REVISION" | "EXPECTED_STATE_MISMATCH" | "EXPECTED_ROLE_MISMATCH" | "LAST_ACTIVE_ADMIN" | "INTERNAL_ERROR";

export class UserAdministrationError extends Error {
  constructor(public readonly code: UserAdministrationErrorCode, public readonly currentRevision?: number) { super(code); this.name = "UserAdministrationError"; }
}

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function exactKeys(value: Record<string, unknown>, expected: string[]) { const keys=Object.keys(value).sort(); return keys.length===expected.length&&keys.every((key,index)=>key===[...expected].sort()[index]); }
function role(value: unknown): value is AdminUserRole { return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value); }
function status(value: unknown): value is AdminUserStatus { return typeof value === "string" && (USER_STATUSES as readonly string[]).includes(value); }
function revision(value: unknown): value is number { return Number.isInteger(value) && (value as number) >= 0; }
function reason(value: unknown) { if(typeof value!=="string") throw new UserAdministrationError("INVALID_REASON"); const normalized=value.trim(); if(normalized.length<1||normalized.length>500) throw new UserAdministrationError("INVALID_REASON"); return normalized; }

export function parseStatusChange(value: unknown): StatusChangeInput {
  if(!record(value)||!exactKeys(value,["expectedStatus","expectedRevision","status","reason"])||!status(value.expectedStatus)||!status(value.status)||!revision(value.expectedRevision)) throw new UserAdministrationError("INVALID_INPUT");
  return { expectedStatus:value.expectedStatus, expectedRevision:value.expectedRevision, status:value.status, reason:reason(value.reason) };
}
export function parseRoleChange(value: unknown): RoleChangeInput {
  if(!record(value)||!exactKeys(value,["expectedRole","expectedRevision","role","reason"])||!role(value.expectedRole)||!role(value.role)||!revision(value.expectedRevision)) throw new UserAdministrationError("INVALID_INPUT");
  return { expectedRole:value.expectedRole, expectedRevision:value.expectedRevision, role:value.role, reason:reason(value.reason) };
}

export function parseListQuery(url: URL): AdminListQuery {
  const allowed=new Set(["cursor","limit","search","role","status"]); for(const key of url.searchParams.keys()) if(!allowed.has(key)) throw new UserAdministrationError("INVALID_FILTER");
  const rawLimit=url.searchParams.get("limit"); const limit=rawLimit===null?25:Number(rawLimit);
  if(!Number.isInteger(limit)||limit<1||limit>50) throw new UserAdministrationError("INVALID_FILTER");
  const rawRole=url.searchParams.get("role"); const rawStatus=url.searchParams.get("status");
  if(rawRole!==null&&!role(rawRole)) throw new UserAdministrationError("INVALID_FILTER");
  if(rawStatus!==null&&!status(rawStatus)) throw new UserAdministrationError("INVALID_FILTER");
  const search=(url.searchParams.get("search")??"").trim(); if(search.length>120) throw new UserAdministrationError("INVALID_FILTER");
  return { search, role:rawRole??undefined, status:rawStatus??undefined, limit, cursor:url.searchParams.get("cursor")??undefined };
}

type Cursor = { version:1; createdAt:string; id:string; filterHash:string };
export function queryHash(query: Pick<AdminListQuery,"search"|"role"|"status">) { return createHash("sha256").update(JSON.stringify({search:query.search.toLocaleLowerCase("pt-BR"),role:query.role??null,status:query.status??null})).digest("base64url").slice(0,22); }
export function encodeAdminCursor(item:{createdAt:string|Date;id:string}, filterHash:string) { return Buffer.from(JSON.stringify({version:1,createdAt:new Date(item.createdAt).toISOString(),id:item.id,filterHash} satisfies Cursor)).toString("base64url"); }
export function decodeAdminCursor(value:string, expectedHash?:string):Cursor { try { if(!value||value.length>1024||!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(); const parsed=JSON.parse(Buffer.from(value,"base64url").toString()) as Cursor; if(parsed.version!==1||typeof parsed.id!=="string"||!parsed.id||typeof parsed.filterHash!=="string"||Number.isNaN(Date.parse(parsed.createdAt))||Object.keys(parsed).sort().join()!==["createdAt","filterHash","id","version"].sort().join()) throw new Error(); if(expectedHash&&parsed.filterHash!==expectedHash) throw new UserAdministrationError("CURSOR_FILTER_MISMATCH"); return parsed; } catch(error) { if(error instanceof UserAdministrationError) throw error; throw new UserAdministrationError("INVALID_CURSOR"); } }

export function serializeAdminUser(user:{id:string;firstName:string;lastName:string;email:string;role:string;status:string;revision:number;createdAt:Date;updatedAt:Date}):AdminUserDto { if(!role(user.role)||!status(user.status)) throw new UserAdministrationError("INTERNAL_ERROR"); return {id:user.id,firstName:user.firstName,lastName:user.lastName,email:user.email,role:user.role,status:user.status,revision:user.revision,createdAt:user.createdAt.toISOString(),updatedAt:user.updatedAt.toISOString()}; }
