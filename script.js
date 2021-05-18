//Author: Satsang Adhikari
//Purpose: Amazon web scraper script that emails client when the specified item has gone down in price below the specified limit

const nightmare = require("nightmare")();
const cron = require("node-cron"); 
const nodemailer = require("nodemailer");

const url = "https://www.amazon.ca/Soccer-Jerseys-2020-21-Football-Uniform/dp/B08DRR7JCT/"

async function checkPrice() { //https://www.npmjs.com/package/nightmare
   
        const priceStr = await nightmare.goto(url)
        .wait("#priceblock_ourprice")
        .evaluate(() => document.getElementById("priceblock_ourprice").innerText)

        const priceNum = Number(priceStr.replace("$", ""));
        
        if (priceNum < 70) {
            console.log("BUY! " + priceNum);
            sendEmail(priceNum);
        }

}

async function intervalTrack() {    //https://www.npmjs.com/package/node-cron    
    cron.schedule('* * * * *', () => {                    //This cron process runs every 1 minute
        checkPrice();
    });    
}

async function sendEmail(price) { //https://www.w3schools.com/nodejs/nodejs_email.asp

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '...@gmail.com',
        pass: '....'
      }
    });
  
    transporter.sendMail({
      from: '"Amazon Price Tracker" <...@gmail.com>',
      to: "...@gmail.com",
      subject: 'Price for the Amazon item dropped!', 
      text: `Amazon item You Were Tracking Has Gone Down In Price To $${price}!  ${url}`,

    }, function(error, info) {
        if (error) { console.log(error) }
        else { console.log("Message sent to client."); }
    });
}

intervalTrack();
