
const puppeteer = require('@all-in-js/fast-install-puppeteer');

class Puppeteer {
    constructor({ devices = [], device = '', cookies } = options) {
        this.devices = devices;
        this.device = devices[device] || [375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'],
            this.browser = null;
    }
    async launch() {
        // TODO headless 统一配置
        this.browser = await puppeteer.launch({ headless: false, devtools: true });
    }
    async newPage(url, headers) {
        const { cookies } = headers || {};
        const page = await this.browser.newPage();
        await page.setUserAgent(this.device[2]);
        await page.setViewport({ width: this.device[0], height: this.device[1] })
        if (cookies) {
            await page.setCookie(...cookies);
        }
        await page.goto(url, {
            timeout: 60 * 1000,
            waitUntil: 'networkidle0'
        })
        return page
    }
}
module.exports = Puppeteer