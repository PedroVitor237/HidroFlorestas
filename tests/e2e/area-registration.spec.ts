import { test, expect, type BrowserContext, type Page, type TestInfo } from "@playwright/test";
import { AREA_FIXTURES, setupAreaFixtures, cleanupAreaFixtures, countAreaFixtures, createAreaFixtureClient } from "../fixtures/areas";
import { signSessionToken } from "../../src/app/api/server/auth/session";
const lab=AREA_FIXTURES.laboratoryIds[0];const root=`/dashboard/laboratories/${lab}/areas`;const api=`/api/laboratories/${lab}/areas`;
async function login(context:BrowserContext,info:TestInfo,index=0){await context.addCookies([{name:"auth_token",value:signSessionToken(AREA_FIXTURES.userIds[index]),url:String(info.project.use.baseURL)}]);}
async function confirmArea(page:Page,name:string){
 const responsePromise=page.waitForResponse(response=>response.url().endsWith(api)&&response.request().method()==='POST',{timeout:30_000});
 await page.getByRole('button',{name:'Confirmar ponto e cadastrar'}).click();
 const response=await responsePromise;expect(response.status()).toBe(201);const {area}=await response.json();expect(area.name).toBe(name);expect(response.headers()['location']).toBe(`/dashboard/laboratories/${lab}/areas/${area.id}`);
 await page.waitForURL(`/dashboard/laboratories/${lab}/areas/${area.id}`,{timeout:30_000});await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
}
test.describe.configure({mode:"serial"});
test.setTimeout(90_000);
test.beforeAll(async()=>{await setupAreaFixtures(process.env);});
test.afterAll(async()=>{await cleanupAreaFixtures(process.env);expect(await countAreaFixtures(process.env)).toEqual({users:0,laboratories:0,memberships:0,areas:0});});
test.beforeEach(async({context})=>{await context.route('https://tile.openstreetmap.org/**',route=>route.abort());});
test("backend enforces current role, isolation, ownership privacy and account eligibility",async({context},info)=>{
 await login(context,info,1);
 const created=await context.request.post(api,{data:{name:"IMP-003 E2E API",latitude:90,longitude:-180}});expect(created.status()).toBe(201);const {area}=await created.json();
 expect(area.latitude).toBe(90);expect(area.longitude).toBe(-180);expect(Object.keys(area).sort()).toEqual(["id","name","latitude","longitude","municipality","state","landType","description","createdAt","laboratory","readOnly"].sort());
 expect(created.headers()["cache-control"]).toBe("no-store");
 const db=createAreaFixtureClient(process.env);
 try{
  const persisted=await db.collectionArea.findUniqueOrThrow({where:{id:area.id}});expect(persisted.userId).toBe(AREA_FIXTURES.userIds[1]);
  await login(context,info,2);
  expect((await context.request.get(api)).status()).toBe(200);
  expect((await context.request.post(api,{data:{name:"IMP-003 E2E forbidden",latitude:0,longitude:0}})).status()).toBe(403);
  await db.user.update({where:{id:AREA_FIXTURES.userIds[2]},data:{role:"ADMIN",}});
  expect((await context.request.post(api,{data:{name:"IMP-003 E2E global",latitude:0,longitude:0}})).status()).toBe(403);
  await db.user.update({where:{id:AREA_FIXTURES.userIds[2]},data:{status:"BLOCKED"}});
  expect((await context.request.get(api)).status()).toBe(401);
  await db.user.update({where:{id:AREA_FIXTURES.userIds[2]},data:{status:"ACTIVE",role:"USER",}});
  await db.researchersLinked.delete({where:{userId_laboratoryRoomId:{userId:AREA_FIXTURES.userIds[2],laboratoryRoomId:lab}}});
  expect((await context.request.get(api)).status()).toBe(404);
  await db.researchersLinked.create({data:{userId:AREA_FIXTURES.userIds[2],laboratoryRoomId:lab,role:"MEMBER"}});
  await login(context,info,0);
  const other=`/api/laboratories/${AREA_FIXTURES.laboratoryIds[1]}/areas/${area.id}`;
  expect((await context.request.get(other)).status()).toBe(404);
  const inactive=await context.request.post(`/api/laboratories/${AREA_FIXTURES.laboratoryIds[1]}/areas`,{data:{name:"IMP-003 E2E inactive",latitude:0,longitude:0}});expect(inactive.status()).toBe(409);
  await login(context,info,3);expect((await context.request.get(`${api}/${area.id}`)).status()).toBe(404);
 }finally{await db.$disconnect();}
});
test("explicit context and manual registration survive reload without tiles",async({page,context},info)=>{
 await login(context,info);await page.goto('/dashboard');await expect(page).toHaveURL(/\/workspace$/);
 await page.goto(root);await page.getByRole('link',{name:'Nova área',exact:true}).click();
 await page.getByLabel('Nome da área').fill('IMP-003 E2E manual');await page.getByLabel('Latitude',{exact:true}).fill('-3.1234567');await page.getByLabel('Longitude',{exact:true}).fill('-38.6');
 await expect(page.getByRole('region',{name:'Mapa da área'})).toBeVisible();
 await confirmArea(page,'IMP-003 E2E manual');
 await page.reload();await expect(page.getByText('Latitude: -3.123457 · Longitude: -38.6',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Voltar às áreas'}).click();await expect(page.getByRole('link',{name:'IMP-003 E2E manual',exact:true})).toBeVisible();
 await expect(page.locator('.leaflet-container')).toHaveCount(0);
});
test("map selection remains editable and saves only on confirmation",async({page,context},info)=>{
 await login(context,info);await page.goto(`${root}/new`);await page.getByLabel('Nome da área').fill('IMP-003 E2E map');
 const before=(await (await context.request.get(api)).json()).areas.length;
 await page.locator('.leaflet-container').click({position:{x:150,y:130}});
 await expect(page.getByLabel('Latitude',{exact:true})).not.toHaveValue('');
 await page.getByLabel('Latitude',{exact:true}).fill('-4');await page.getByLabel('Longitude',{exact:true}).fill('-39');
 expect((await (await context.request.get(api)).json()).areas.length).toBe(before);
 await confirmArea(page,'IMP-003 E2E map');
});
test("late and denied geolocation preserve edited fields",async({page,context},info)=>{
 await login(context,info);await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(success:(p:unknown)=>void)=>{setTimeout(()=>success({coords:{latitude:12,longitude:13}}),1000);}}});});
 await page.goto(`${root}/new`);await page.getByLabel('Nome da área').fill('IMP-003 E2E geolocation');
 await page.getByRole('button',{name:'Usar minha localização'}).click();await page.getByLabel('Latitude',{exact:true}).fill('-5');await page.getByLabel('Longitude',{exact:true}).fill('-40');
 await expect(page.getByRole('button',{name:'Usar minha localização'})).toBeEnabled();expect(await page.getByLabel('Latitude',{exact:true}).inputValue()).toBe('-5');
 await page.evaluate(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition:(_success:unknown,error:()=>void)=>error()}});});
 await page.getByRole('button',{name:'Usar minha localização'}).click();await expect(page.getByRole('status')).toContainText('Seus dados foram preservados');expect(await page.getByLabel('Latitude',{exact:true}).inputValue()).toBe('-5');
 await confirmArea(page,'IMP-003 E2E geolocation');
});
test("essential flow and map have usable dimensions across viewports",async({page,context},info)=>{
 await login(context,info);
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(`${root}/new`);const map=page.getByRole('region',{name:'Mapa da área'});await expect(map).toBeVisible();const box=await map.boundingBox();expect(box!.width).toBeGreaterThan(200);expect(box!.height).toBeGreaterThan(200);
  await page.getByLabel('Nome da área').focus();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.tagName)).not.toBe('BODY');
 }
 await page.screenshot({path:'test-results/imp003-desktop.png',fullPage:true});
});
