import { expect,test } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";
import { hashPayload } from "../../src/app/api/server/environmental-data/environmental-data.contracts";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
import { ENVIRONMENTAL_FIXTURES as F,setupEnvironmentalFixtures,cleanupEnvironmentalFixtures,countEnvironmentalFixtures,createEnvironmentalFixtureClient } from "../fixtures/environmental-data-fixtures";
test.describe.configure({mode:'serial'});test.setTimeout(90000);
test.beforeAll(async()=>{
 await setupEnvironmentalFixtures(process.env);const db=createEnvironmentalFixtureClient(process.env.TEST_DATABASE_URL!);
 try{const payload=validEnvironmentalPayload();await db.environmentalMeasurementSet.create({data:{collectionDataId:F.collectionIds[0],userId:F.userIds[0],measurementContractVersion:'ihfr-measurement-v1',payload,payloadHash:hashPayload(payload),confirmationKey:crypto.randomUUID(),confirmedAt:new Date()}});}finally{await db.$disconnect();}
});
test.afterAll(async()=>{await cleanupEnvironmentalFixtures(process.env);expect(Object.values(await countEnvironmentalFixtures(process.env)).every(n=>n===0)).toBe(true);});
const base=`/dashboard/laboratories/${F.laboratoryIds[0]}/areas/${F.areaIds[0]}/collections/${F.collectionIds[0]}/environmental-data`;
test('independent read shows provenance, null/zero/false, mobile and desktop without overflow',async({page,context},info)=>{
 for(const actor of F.userIds.slice(0,3)){
  await context.addCookies([{name:'auth_token',value:signSessionToken(actor),url:String(info.project.use.baseURL)}]);
  await page.goto(base);await expect(page.getByRole('region',{name:'Origem da coleta'})).toContainText(F.collectionIds[0]);
 }
 await expect(page.getByRole('region',{name:'Água',exact:true})).toContainText('Não');await expect(page.getByRole('region',{name:'Terreno',exact:true})).toContainText('Não informado');
 await expect(page.getByRole('article',{name:'Dados ambientais da coleta'}).getByText(/Contrato de captura: ihfr-measurement-v1/).first()).toBeVisible();
 for(const [name,width,height] of [['desktop',1366,900],['mobile',390,844]] as const){
  await page.setViewportSize({width,height});await page.screenshot({path:info.outputPath(`read-${name}.png`),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 }
 await page.getByRole('link',{name:'Voltar à coleta'}).focus();await expect(page.getByRole('link',{name:'Voltar à coleta'})).toBeFocused();
});
test('absence and direct API access distinguish missing data from inaccessible context',async({page,context},info)=>{
 await context.addCookies([{name:'auth_token',value:signSessionToken(F.userIds[0]),url:String(info.project.use.baseURL)}]);
 const absent=`/dashboard/laboratories/${F.laboratoryIds[1]}/areas/${F.areaIds[1]}/collections/${F.collectionIds[1]}/environmental-data`;
 await page.goto(absent);await expect(page.getByRole('heading',{name:'Nenhum dado ambiental registrado'})).toBeVisible();await expect(page.getByRole('link',{name:'Registrar dados ambientais',exact:true})).toHaveCount(0);
 const response=await page.request.get(absent.replace('/dashboard/','/api/'));expect(response.status()).toBe(200);expect(await response.json()).toEqual({environmentalData:null});
 await context.addCookies([{name:'auth_token',value:signSessionToken(F.userIds[3]),url:String(info.project.use.baseURL)}]);
 const denied=await page.request.get(base.replace('/dashboard/','/api/'));expect(denied.status()).toBe(404);
 const missing=await page.request.get(base.replace('/dashboard/','/api/').replace(F.collectionIds[0],'00000000-0000-4000-8000-000000000999'));expect(await missing.json()).toEqual(await denied.json());
});
