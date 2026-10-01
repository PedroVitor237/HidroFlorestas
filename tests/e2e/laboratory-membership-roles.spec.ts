import { test, expect } from "@playwright/test";
import { AREA_FIXTURES, setupAreaFixtures, cleanupAreaFixtures, countAreaFixtures } from "../fixtures/areas";
import { signSessionToken } from "../../src/app/api/server/auth/session";
test.describe.configure({mode:"serial"});
test.beforeAll(async()=>{await setupAreaFixtures(process.env);});
test.afterAll(async()=>{await cleanupAreaFixtures(process.env);expect(await countAreaFixtures(process.env)).toEqual({users:0,laboratories:0,memberships:0,areas:0});});
test("owner promotes and demotes; stale role and inactive laboratory reject changes",async({page,context},info)=>{
 await context.addCookies([{name:"auth_token",value:signSessionToken(AREA_FIXTURES.userIds[0]),url:String(info.project.use.baseURL)}]);
 const lab=AREA_FIXTURES.laboratoryIds[0];
 await page.goto(`/dashboard/laboratories/${lab}/members`);
 const promoted=page.waitForResponse(response=>response.url().includes(`/api/laboratories/${lab}/memberships/`)&&response.request().method()==='PATCH',{timeout:30_000});
 await page.getByRole("button",{name:"Promover Member IMP003"}).click();expect((await promoted).status()).toBe(200);
 await expect(page.getByRole("button",{name:"Rebaixar Member IMP003"})).toBeVisible();
 const list=await (await context.request.get(`/api/laboratories/${lab}/memberships`)).json();
 const member=list.memberships.find((m:{name:string})=>m.name==="Member IMP003");
 expect((await context.request.patch(`/api/laboratories/${lab}/memberships/${member.id}`,{data:{expectedRole:"MEMBER",role:"ADMIN"}})).status()).toBe(409);
 const demoted=page.waitForResponse(response=>response.url().includes(`/api/laboratories/${lab}/memberships/`)&&response.request().method()==='PATCH',{timeout:30_000});
 await page.getByRole("button",{name:"Rebaixar Member IMP003"}).click();expect((await demoted).status()).toBe(200);
 await expect(page.getByRole("button",{name:"Promover Member IMP003"})).toBeVisible();
 const inactive=AREA_FIXTURES.laboratoryIds[1];
 await page.goto(`/dashboard/laboratories/${inactive}/members`);
 await expect(page.getByText("Laboratório inativo — somente leitura.")).toBeVisible();
 await expect(page.getByRole("button",{name:/Promover|Rebaixar/})).toHaveCount(0);
});
test("administrator cannot manage contextual roles",async({context},info)=>{
 await context.addCookies([{name:"auth_token",value:signSessionToken(AREA_FIXTURES.userIds[1]),url:String(info.project.use.baseURL)}]);
 const response=await context.request.get(`/api/laboratories/${AREA_FIXTURES.laboratoryIds[0]}/memberships`);
 expect(response.status()).toBe(403);expect(response.headers()["cache-control"]).toBe("no-store");
});
