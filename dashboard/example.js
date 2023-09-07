const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto('https://twitter.com/bauto_DZ/status/1658047844987666434?s=20',{waitUntil: 'networkidle2'});
    
    const xpath = '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[1]/div/div[1]'
    const elems = await page.$x(xpath);
    const jsHandle = await elems[0].getProperty('textContent');
    const text = await jsHandle.jsonValue();
    await page.screenshot({path: 'screenshot.png'});
    await console.log(text);
    await browser.close();
})();