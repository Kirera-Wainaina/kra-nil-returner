import puppeteer, { Browser, Page } from "puppeteer";
import * as dotenv from "dotenv";

dotenv.config()

async function fileReturn() {
  const browser = await puppeteer.launch();
  const loginPage = await getLoginPage(browser)
  await enterKRAPIN(loginPage)
  // await enterPassword(loginPage)
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

fileReturn()