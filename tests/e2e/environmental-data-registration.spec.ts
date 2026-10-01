import { expect,test } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";
import { ENVIRONMENTAL_FIXTURES as F,setupEnvironmentalFixtures,cleanupEnvironmentalFixtures,countEnvironmentalFixtures } from "../fixtures/environmental-data-fixtures";
test.describe.configure({mode:'serial'});test.setTimeout(90000);
test.beforeAll(async()=>setupEnvironmentalFixtures(process.env));
test.afterAll(async()=>{await cleanupEnvironmentalFixtures(process.env);expect(Object.values(await countEnvironmentalFixtures(process.env)).every(n=>n===0)).toBe(true);});
const base=`/dashboard/laboratories/${F.laboratoryIds[0]}/areas/${F.areaIds[0]}/collections/${F.collectionIds[0]}/environmental-data`;
test('registers through review, rejects invalid values and retries the same operation after lost response',async({page,context},info)=>{
 await context.addCookies([{name:'auth_token',value:signSessionToken(F.userIds[2]),url:String(info.project.use.baseURL)}]);
 await page.goto(base+'/new');await expect(page.getByRole('heading',{name:'Registrar dados ambientais',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Revisar dados',exact:true}).click();await expect(page.getByText('Revise os campos indicados')).toBeVisible();
 await page.getByLabel('Fonte de água').selectOption('RIVER_STREAM');await page.getByLabel('Há nascente').selectOption('false');await page.getByLabel('Disponibilidade hídrica').selectOption('PERMANENT');
 await page.getByLabel('Textura do solo').selectOption('SANDY');await page.getByLabel('Taxa de infiltração').fill('0');await page.getByLabel('Compactação').selectOption('LOW');await page.getByLabel('Sinais de erosão').selectOption('NONE');
 await page.getByLabel('Cobertura vegetal').fill('101');await page.getByLabel('Fragmentação').selectOption('LOW');await page.getByLabel('Degradação da paisagem').selectOption('LOW');
 await page.getByRole('button',{name:'Revisar dados',exact:true}).click();await expect(page.getByLabel('Cobertura vegetal')).toHaveAttribute('aria-invalid','true');
 await page.getByLabel('Cobertura vegetal').fill('0');
 await page.screenshot({path:info.outputPath('registration-desktop.png'),fullPage:true});
 await page.getByRole('button',{name:'Revisar dados',exact:true}).click();await expect(page.getByRole('heading',{name:'Revisar dados ambientais'})).toBeFocused();
 await expect(page.getByRole('region',{name:'Água',exact:true})).toContainText('Não informado');
 const keys:string[]=[];let lost=false;let confirmed=false;let delayedDetailReads=0;
 await page.route('**/environmental-data**',async route=>{
  if(route.request().method()==='GET'){
   if(confirmed&&new URL(route.request().url()).pathname===base){delayedDetailReads++;await new Promise(resolve=>setTimeout(resolve,6500));}
   await route.continue();return;
  }
  if(route.request().method()!=='POST'){await route.continue();return;}
  keys.push(route.request().headers()['idempotency-key']);
  if(!lost){lost=true;await route.fetch();await route.abort('failed');}
  else{const response=await route.fetch();confirmed=true;await route.fulfill({response});}
 });
 await page.getByRole('button',{name:'Confirmar dados ambientais',exact:true}).click();await expect(page.getByText('Não foi possível verificar a confirmação.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Voltar ao formulário'})).toBeDisabled();
 const persisted=page.waitForResponse(response=>response.url().endsWith('/environmental-data')&&response.request().method()==='POST');
 await page.getByRole('button',{name:'Confirmar dados ambientais',exact:true}).click();expect((await persisted).status()).toBe(200);
 await expect(page).toHaveURL(base,{timeout:20000});await expect(page.getByText('Conjunto confirmado e imutável.')).toBeVisible({timeout:20000});
 expect(keys).toHaveLength(2);expect(keys[0]).toBe(keys[1]);expect(delayedDetailReads).toBeGreaterThan(0);
 await expect(page.getByRole('region',{name:'Solo',exact:true})).toContainText('0 mm/h');
});
test('inactive laboratory only permits reading and has no registration controls',async({page,context},info)=>{
 await context.addCookies([{name:'auth_token',value:signSessionToken(F.userIds[0]),url:String(info.project.use.baseURL)}]);
 await page.goto(`/dashboard/laboratories/${F.laboratoryIds[1]}/areas/${F.areaIds[1]}/collections/${F.collectionIds[1]}/environmental-data/new`);
 await expect(page.getByText('Laboratório inativo — somente leitura.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Revisar dados',exact:true})).toHaveCount(0);
});
