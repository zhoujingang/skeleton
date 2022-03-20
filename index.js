const fs = require('fs-extra');
const path = require('path');
const Puppeteer = require('./lib/pupeteer');
const drawSkeleton = require('./lib/drawSkeleton');
const configDefault = require('./config.default');
const cheerio = require('cheerio');
const defaultHtml = require('./html.default');
const ora = require('ora');
class Skeleton {
    constructor(options) {
        // TODO 参数校验 joi
        this.root = "#root";
        // this.openBrowser()

    }

    /**
     * 初始化配置
     */
    async init() {
        try {
            const str = fs.readFileSync(path.resolve(__dirname, './config.default.js'), 'utf8');
            await fs.writeFileSync(path.resolve(process.cwd(), './config.js'), str)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 绘制骨架屏
     */
    async openBrowser() {
        // TODO 参数校验
        let config = require(path.resolve(process.cwd(), './config.js'))
        config = Object.assign(configDefault, config);
        const { url } = config;
        if (!url) {
            throw new Error('url is required!')
        }
        const browser = new Puppeteer(config);
        await browser.launch();
        const page = await browser.newPage(config.url, config.headers);
        const { html, reactHtml} = await page.evaluate(drawSkeleton, config);
        const $ = cheerio.load(defaultHtml);
        $(this.root).html(html);
        await fs.writeFileSync(path.resolve(process.cwd(), './index.html'), $.root().html());
        await fs.writeFileSync(path.resolve(process.cwd(), './index.React'), reactHtml);
    }

}

const start = (argv) => {
    const spinner = ora('请稍后...').start();
    const command = process.argv.slice(2)[0]
    const skeleton = new Skeleton(argv);
    switch (command) {
        case 'init':
            skeleton.init();
            spinner.info('配置加载中...')
            spinner.color = 'green';
            setTimeout(() => {
                spinner.succeed('配置加载成功,在当前目录下 config.js 中可自定义定制骨架屏！')
            }, 500)
            break;
        case 'start':
            spinner.info('骨架屏生成中...')
            skeleton.openBrowser();
            setTimeout(() => {
                spinner.succeed('骨架屏绘制成功！已保存至当前目录 index.html!')
            }, 500)
            break;
        default:
            spinner.warn('不存在该执行命令！') ;
    }
}

module.exports = start;