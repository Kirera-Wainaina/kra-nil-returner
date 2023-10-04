import puppeteer, { Browser, Page } from "puppeteer";
import * as dotenv from "dotenv";
import { writeFile } from "fs/promises"
import * as path from "path";
import { findExtensionFromMIMEType } from "./MIMETypes"

dotenv.config()

async function fileReturn() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const loginPage = await getLoginPage(browser)
  await enterKRAPIN(loginPage)
  await enterPassword(loginPage)
  await downloadCaptchaImage(browser, loginPage)
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

async function downloadCaptchaImage(browser:Browser, loginPage:Page) {
  const captchaLink = await loginPage.evaluate(() => {
    const captcha = document.getElementById('captcha_img') as HTMLImageElement;
    return captcha.src
  })
  const newPage = await browser.newPage()

  newPage.on('response', async response => {
    if (response.request().resourceType() === "image" ||
      response.request().resourceType() === "document") {
      const buffer = await response.buffer();
      const extension = findExtensionFromMIMEType(response.headers()['content-type'])
      await writeFile(path.join(__dirname, `captcha${extension}`), buffer)
      console.log('captcha saved')
    }
  })
  await newPage.goto(captchaLink)
}
fileReturn()