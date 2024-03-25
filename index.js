const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
// const formData = require('form-data');
const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);

dotenv.config()

functions.cloudEvent('verifyUser', cloudEvent => {
    const base64name = cloudEvent.data.message.data;

    // const mg = mailgun.client({ username: 'key', key: `key-${process.env.MAILGUN_API_KEY}` });

    // const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    const mailgun = new Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: "aniketgiram.me" });

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
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    };

    mailgun.messages().send(mail_data, function (err, body) {
        // If there is an error, render the error page
        if (err) {
            res.render('error', { error: err });
            console.log("Got an error:", err);
        } else {
            // Here "submitted.jade" is the view file for this landing page
            // We pass the variable "email" from the url parameter in an object rendered by Jade
            res.render('submitted', { email: mail_data.to });
            console.log(body);
        }
    });
});
