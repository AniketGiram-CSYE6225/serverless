const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

dotenv.config()

functions.cloudEvent('verifyUser', cloudEvent => {
    const base64name = cloudEvent.data.message.data;

    const mg = mailgun.client({ username: 'giram.a@northeastern.edu', key: process.env.MAILGUN_API_KEY});
    // const mg = mailgun.client({ key: process.env.MAILGUN_API_KEY });

    const data = base64name
        ? Buffer.from(base64name, 'base64').toString()
        : 'World';

    const decodedData = JSON.parse(data);
    console.log(`decoded_data`, decodedData, typeof decodedData)
    console.log(`Hello, ${data}!`);
    mg.messages.create('aniketgiram.me', {
        from: "aniketgiram.me",
        to: ["aniketgiram1@gmail.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness!</h1>"
    })
        .then(msg => console.log("success", msg)) // logs response data
        .catch(err => console.error("err", err));
});
