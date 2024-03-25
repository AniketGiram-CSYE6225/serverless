const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

dotenv.config()

functions.cloudEvent('verifyUser', cloudEvent => {
    const base64name = cloudEvent.data.message.data;

    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    
    const data = base64name
        ? Buffer.from(base64name, 'base64').toString()
        : 'World';

    const decodedData = JSON.parse(data);
    console.log(`decoded_data`, decodedData, typeof decodedData)
    console.log(`Hello, ${data}!`);

    var mail_data = {
        from: "aniketgiram.me",
        to: "aniketgiram1@gmail.com",
        subject: 'Hello from Mailgun',
        Text: "this is a text message",
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?">Click here to add your email address to a mailing list</a>'
    };

    mg.messages.create('aniketgiram.me', mail_data)
        .then(msg => console.log(msg))
        .catch(err => console.error(err));
});
