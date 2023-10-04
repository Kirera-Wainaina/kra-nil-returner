import puppeteer, { Browser, Page } from "puppeteer";
import * as dotenv from "dotenv";

dotenv.config()

async function fileReturn() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const loginPage = await getLoginPage(browser)
  await enterKRAPIN(loginPage)
  await enterPassword(loginPage)
  // console.log(await loginPage.content())
}
async function getLoginPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  const KRA_LOGIN_URL = "https://itax.kra.go.ke/KRA-Portal/"
  await page.goto(KRA_LOGIN_URL, { waitUntil: 'networkidle0'})
  return page
}

async function enterKRAPIN(loginPage:Page) {
  await loginPage.locator('#logid')
    .fill(process.env.COMPANY_KRA_PIN)

  await loginPage.locator("a.btn")
    .filter(button => button.text == 'Continue')
    .click()
}

async function enterPassword(loginPage:Page) {
  await loginPage.locator('#xxZTT9p2wQ[type="password"]')
    .fill(process.env.COMPANY_PASSWORD)
}

fileReturn()