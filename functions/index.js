// const {variableName} = require('/Users/terranceloughry/Documents/TheTeejers/198-web-scraper-link-preview/react-app/src/App.js');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});

const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');
// hello

const scrapeMetatags = (text) => {


    console.log("this one " + text);
    const urls = Array.from( getUrls(text) );

    const requests = urls.map(async url => {

        const res = await fetch(url);

        const html = await res.text();
        const $ = cheerio.load(html);

        const getMetatag = (name) =>
            $(`meta[name=${name}]`).attr('content') ||
            $(`meta[property="og:${name}"]`).attr('content') ||
            $(`meta[property="twitter:${name}"]`).attr('content');

        return {
            url,
            title: $('title').first().text(),
            favicon: $('link[rel="shortcut icon"]').attr('href'),
            // description: $('meta[name=description]').attr('content'),
            description: getMetatag('description'),
            image: getMetatag('image'),
            author: getMetatag('author'),
        }
    });


    return Promise.all(requests);


}




const puppeteer = require('puppeteer');


const scrapeData = async (creds) => {
    // const browser = await puppeteer.launch( { headless: true});
    const browser = await puppeteer.launch( { headless: true, mode: 'no-cors' });
    const page = await browser.newPage();
    // console.log("this one " + text);


    await page.waitFor(5000);

    // await page.goto('https://www.instagram.com/accounts/login/');
    const response = await page.goto('https://' + creds.location + '.clubspeedtiming.com/sp_center/signin.aspx');



    // Login form
    await page.screenshot({path: '1.png'});
    console.log("looking");
    console.log(creds);



    // await page.type('[name=username]', 'theteejers');
    // await page.type('[name=tbxUserName]', 'TJ Loughry');
    await page.type('[name=tbxUserName]', creds.text);
    // await page.type('[name=tbxUserName]', 'Will Courtright');



    // console.log("name entered");

    // await page.type('[name=password]', 'CatsRKool2!');
    // await page.type('[name=tbxPassword]', 'CatsRKool2!');
    await page.type('[name=tbxPassword]', creds.password);



    // console.log("password entered");

    await page.screenshot({path: '2.png'});

    await page.click('[type=submit]');

    // Social Page

    // await page.waitFor(5000);
    //
    // await page.click('[type=button]');

    // await page.waitFor(5000);

    console.log(page.url());
    console.log(typeof page.url());
    // console.log({ text });

    await page.goto(page.url());

    await page.waitForSelector('tbody ', {
        visible: true,
    });


    await page.screenshot({path: '3.png'});


    // Execute code in the DOM
    // const data = await page.evaluate( () => {
    //
    //     const images = document.querySelectorAll('a');
    //
    //     const urls = Array.from(images).map(a => a.href);
    //     const urls1 = Array.from(images).map(a => a);
    //
    //     // return images
    //     return urls1
    //     // console.log(urls1);
    // });
    //
    // await browser.close();
    const raceCounts = await page.$$eval('tr.Normal', trs => trs.length);
    // console.log(raceCounts)
    let dataArray = []

    const [name] = await page.$x('//*[@id="lblRacerName"]');
    const txt = await name.getProperty('textContent');
    const nameData = await txt.jsonValue();
    console.log({nameData});


    var i;
    for (i = 2; i < raceCounts+2; i++) {
      var arrayName = []
      // console.log(i);
      const raceNumber = -1*(i - raceCounts - 2)


      const [el] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[1]/a');
      const txt = await el.getProperty('href');
      const heatLink = await txt.jsonValue();


      const [el0] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[1]');
      const txt0 = await el0.getProperty('textContent');
      const heatTypeAndKart = await txt0.jsonValue();
      let heatData = heatTypeAndKart.split(' - Kart ')
      const heatType = heatData[0]
      const kartNumberLong = heatData[1]
      if (kartNumberLong < 10) {
        var kartNumber = "0".concat(kartNumberLong)
      } else {
        var kartNumber = kartNumberLong
      }

      const [el1] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[2]');
      const txt1 = await el1.getProperty('textContent');
      const dateTimeLong = await txt1.jsonValue();
      const dateTimeShort = dateTimeLong.trim();
      const dateTimeSplit = dateTimeShort.split(" ")
      const date = dateTimeSplit[0]
      const time = dateTimeSplit.splice(1,2).toString().replace(",", " ")


      const [el2] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[3]');
      const txt2 = await el2.getProperty('textContent');
      const k1rsLong = await txt2.jsonValue();
      const k1rsSplit = k1rsLong.split(" ")
      const k1rsTotal = k1rsSplit[0]
      const k1rsEarned = k1rsSplit[1].toString().replace(/[()]/g,'')

      const [el3] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[4]');
      const txt3 = await el3.getProperty('textContent');
      const bestTime = await txt3.jsonValue();

      const [el4] = await page.$x('//*[@id="dg"]/tbody/tr['+i+']/td[5]');
      const txt4 = await el4.getProperty('textContent');
      const positionLong = await txt4.jsonValue();
      const position = positionLong.trim();




      // arrayName.push(heatType1, dateTime, k1rs, bestTime, position)
      var raceData = {raceNumber, heatTypeAndKart, heatLink, heatType, kartNumber, date, time, k1rsTotal, k1rsEarned, bestTime, position, nameData}
      // console.log(arrayName);
      // console.log(typeof raceData);
      // console.log(raceData);
      dataArray.push(raceData)

    }

  // console.log(dataArray[50]);


    // fs.writeFile("./public/raceData.json", JSON.stringify(dataArray), "utf8", (err, data) => {
    //   if (err) {
    //   console.error(err);
    // } else {
    //   console.log("created!");
    // }});

    await browser.close();


    // console.log("Here " + dataArray)

    return dataArray;
}




exports.scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {


      const body = JSON.parse(request.body);
        // const body = JSON.parse(request.body);
        // const data1 = await scrapeMetatags(body.password);

        const data = await scrapeData(body.creds);

        response.send(data)



    });
});
