import { NextResponse } from "next/server";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { GlobalAuthorityError } from "./global-authority";
import { UserAdministrationError, type UserAdministrationErrorCode } from "./user-administration.contracts";

const messages:Record<UserAdministrationErrorCode,string>={
 INVALID_INPUT:"Os dados informados são inválidos.",INVALID_FILTER:"Os filtros informados são inválidos.",INVALID_CURSOR:"O cursor informado é inválido.",CURSOR_FILTER_MISMATCH:"Atualize a lista antes de continuar.",INVALID_REASON:"Informe uma justificativa entre 1 e 500 caracteres.",UNAUTHENTICATED:"Faça login para continuar.",ADMIN_AUTHORITY_REQUIRED:"Esta ação exige administração global.",SELF_CHANGE_FORBIDDEN:"Você não pode alterar seu próprio papel ou estado.",USER_NOT_FOUND:"Usuário não encontrado.",STALE_REVISION:"Esta conta foi alterada desde a última consulta.",EXPECTED_STATE_MISMATCH:"O estado da conta mudou desde a última consulta.",EXPECTED_ROLE_MISMATCH:"O papel da conta mudou desde a última consulta.",LAST_ACTIVE_ADMIN:"A operação deixaria a plataforma sem um administrador ativo.",INTERNAL_ERROR:"Não foi possível concluir a solicitação."
};
export function administrationJson(data:unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});}
export function administrationError(error:unknown){let code:UserAdministrationErrorCode="INTERNAL_ERROR";let currentRevision:number|undefined;
 if(error instanceof UserAdministrationError){code=error.code;currentRevision=error.currentRevision;}
 else if(error instanceof GlobalAuthorityError)code="ADMIN_AUTHORITY_REQUIRED";
 else if(error instanceof AuthBoundaryError)code=error.code==="UNAUTHORIZED"?"UNAUTHENTICATED":"INTERNAL_ERROR";
 const status=code==="UNAUTHENTICATED"?401:["ADMIN_AUTHORITY_REQUIRED","SELF_CHANGE_FORBIDDEN"].includes(code)?403:code==="USER_NOT_FOUND"?404:["STALE_REVISION","EXPECTED_STATE_MISMATCH","EXPECTED_ROLE_MISMATCH","LAST_ACTIVE_ADMIN"].includes(code)?409:["INVALID_INPUT","INVALID_FILTER","INVALID_CURSOR","CURSOR_FILTER_MISMATCH","INVALID_REASON"].includes(code)?400:500;
 const recovery=["STALE_REVISION","EXPECTED_STATE_MISMATCH","EXPECTED_ROLE_MISMATCH"].includes(code)?"REFRESH_TARGET":code==="LAST_ACTIVE_ADMIN"?"ENSURE_ANOTHER_ACTIVE_ADMIN":undefined;
 return administrationJson({error:{code,message:messages[code],...(currentRevision===undefined?{}:{currentRevision}),...(recovery?{recovery}:{})}},status);
}
