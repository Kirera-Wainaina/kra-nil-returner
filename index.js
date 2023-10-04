"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const dotenv = __importStar(require("dotenv"));
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
const MIMETypes_1 = require("./MIMETypes");
dotenv.config();
function fileReturn() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: 'new' });
        const loginPage = yield getLoginPage(browser);
        yield enterKRAPIN(loginPage);
        yield enterPassword(loginPage);
        yield downloadCaptchaImage(browser, loginPage);
    });
}
function getLoginPage(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        const KRA_LOGIN_URL = "https://itax.kra.go.ke/KRA-Portal/";
        yield page.goto(KRA_LOGIN_URL, { waitUntil: 'networkidle0' });
        return page;
    });
}
function enterKRAPIN(loginPage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loginPage.locator('#logid')
            .fill(process.env.COMPANY_KRA_PIN);
        yield loginPage.locator("a.btn")
            .filter(button => button.text == 'Continue')
            .click();
    });
}
function enterPassword(loginPage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loginPage.locator('#xxZTT9p2wQ[type="password"]')
            .fill(process.env.COMPANY_PASSWORD);
    });
}
function downloadCaptchaImage(browser, loginPage) {
    return __awaiter(this, void 0, void 0, function* () {
        const captchaLink = yield loginPage.evaluate(() => {
            const captcha = document.getElementById('captcha_img');
            return captcha.src;
        });
        const newPage = yield browser.newPage();
        newPage.on('response', (response) => __awaiter(this, void 0, void 0, function* () {
            if (response.request().resourceType() === "image" ||
                response.request().resourceType() === "document") {
                const buffer = yield response.buffer();
                const extension = (0, MIMETypes_1.findExtensionFromMIMEType)(response.headers()['content-type']);
                yield (0, promises_1.writeFile)(path.join(__dirname, `captcha${extension}`), buffer);
                console.log('captcha saved');
            }
        }));
        yield newPage.goto(captchaLink);
    });
}
fileReturn();
