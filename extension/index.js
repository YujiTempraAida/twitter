module.exports = nodecg => {

    // tweetRepの初期化
    nodecg.Replicant('tweet', {
        defaultValue: {
            tweetUrl:"https://twitter.com/bauto_DZ/status/1692874011993411905",
            iconUrl: "https://twitter.com/bauto_DZ/photo",
            userName: "ばうt",
            userId: "bauto_DZ",
            message: "スポンサーお待ちしております\nこちらダークリンク使えます",
            imageUrl: "https://twitter.com/bauto_DZ/status/1692874011993411905/photo/1"
        }
    });

    // // ※開発用 tweetRepを無理やり更新するスクリプト
    // nodecg.Replicant('tweet').value = {
    //         tweetUrl:"https://twitter.com/bauto_DZ/status/1692874011993411905",
    //         iconUrl: "https://twitter.com/bauto_DZ/photo",
    //         userName: "ばうt",
    //         userId: "bauto_DZ",
    //         message: "スポンサーお待ちしております\nこちらダークリンク使えます",
    //         imageUrl: "https://twitter.com/bauto_DZ/status/1692874011993411905/photo/1"
    //     };

    // tweetUrlMessageをリスンしてtweetRepを更新する関数
    nodecg.listenFor('tweetUrlMessage', (value, ack) => {
        // 入力値のバリデーション処理を入れたい。たぶんackでなんかやる
        ////////////////////////////////////

        // 更新用のオブジェクトを定義
        const obj = {};

        // スクレイプ不要な要素(tweetUrl, iconUrl, userId)をobjに格納
        obj.tweetUrl = value
        obj.userId = value.split('/')[3];

        // puppeteerを呼び出してTweetをスクレイプする
        const puppeteer = require('puppeteer');
        const userNameXpath = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article/div/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/a/div/div[1]/span/span";
        const messageXpath = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[1]/div/div[1]";
        const imageUrlXpath = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[2]/div/div/div/div/div/div/div/a/div/div[2]/div/img";
        const iconUrlXpath = "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article/div/div/div[2]/div[1]/div/div/div/div/div[2]/div/div[2]/div/a/div[3]/div/div[2]/div/div";

        (async () => {
            const browser = await puppeteer.launch({headless: 'new'});
            const page = await browser.newPage();
            await page.goto(value,{waitUntil: 'networkidle2'});
            
            // それぞれ値を取得してtweetRepに格納
            const userNameElems = await page.$x(userNameXpath);
            const userNameJsHandle = await userNameElems[0].getProperty('textContent');
            obj.userName = await userNameJsHandle.jsonValue();

            const messageElems = await page.$x(messageXpath);
            const messageJsHandle = await messageElems[0].getProperty('textContent');
            obj.message = await messageJsHandle.jsonValue();

            const imageUrlElems = await page.$x(imageUrlXpath);
            const imageUrlJsHandle = await imageUrlElems[0].getProperty('src');
            obj.imageUrl = await imageUrlJsHandle.jsonValue();

            // アイコン画像のURLを取得
            obj.iconUrl = await page.evaluate(() => {
                const iconDiv = document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > section > div > div > div:nth-child(1) > div > div > article > div > div > div.css-1dbjc4n.r-18u37iz.r-15zivkp > div.css-1dbjc4n.r-1awozwy.r-onrtq4.r-18kxxzh.r-1b7u577 > div > div > div > div > div.r-1p0dtai.r-1pi2tsx.r-1d2f490.r-u8s1d.r-ipm5af.r-13qz1uu > div > div.r-1p0dtai.r-1pi2tsx.r-1d2f490.r-u8s1d.r-ipm5af.r-13qz1uu > div > a > div.css-1dbjc4n.r-14lw9ot.r-sdzlij.r-1wyvozj.r-1udh08x.r-633pao.r-u8s1d.r-1v2oles.r-desppf > div > div.r-1p0dtai.r-1pi2tsx.r-1d2f490.r-u8s1d.r-ipm5af.r-13qz1uu > div > div');
                if (iconDiv) {
                const style = iconDiv.style.backgroundImage;
                const regex = /url\("(.+)"\)/;
                const match = style.match(regex);
                if (match && match[1]) {
                    return match[1];
                }
                }
                return null;
            });
            console.log(obj.iconUrl)
            

            // objをtweetRepに格納
            nodecg.Replicant('tweet').value = obj;

            await browser.close();
        })();

        
    });
};