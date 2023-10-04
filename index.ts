import puppeteer, { Browser, Page } from "puppeteer";
import * as dotenv from "dotenv";
import * as vision from "@google-cloud/vision"

dotenv.config()

async function fileReturn() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const loginPage = await getLoginPage(browser)
  await enterKRAPIN(loginPage)
  await enterPassword(loginPage)
  const captchaText = await getCaptureText(loginPage)
  // doTheMath(captchaText)
  
  console.log(captchaText)
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

async function getCaptchaLink(loginPage:Page) {
  return loginPage.evaluate(() => {
      const captcha = document.getElementById('captcha_img') as HTMLImageElement;
      return captcha.src
    })
}

async function getCaptureText(loginPage:Page) {
  const captchaLink = await getCaptchaLink(loginPage);
  const client = new vision.ImageAnnotatorClient();
  const [ result ] = await client.textDetection(captchaLink)
  return result.fullTextAnnotation.text
}
fileReturn()