const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
// const { EmailTrack } = require('./model/index.js')

dotenv.config()

functions.cloudEvent('verifyUser', async cloudEvent => {
    try {
        const base64name = cloudEvent.data.message.data;

        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

        const data = base64name ? Buffer.from(base64name, 'base64').toString() : null;

        if (!data) {
            throw new Error("Invalid Payload");
        }

        const decodedData = JSON.parse(data);
        console.log(`decoded_data`, decodedData)

        // const user = await User.findOne({ where: { id: decodedData['userId'] } });
        // if (user == null) {
        //     console.log("User Not found");
        //     return;
        // }
        // console.log("User", user);
        // console.log("creating html data");

        // const html_data = `Hello ${decodedData['firstName']}, <h4>Below is the link to verify your account.</h4><br/><a href="http://aniketgiram.me:8080/v1/userVerification?username=${encodeURIComponent(decodedData['username'])}&userId=${encodeURIComponent(decodedData['userId'])}&firstName=${encodeURIComponent(decodedData['firstName'])}">Click here to verify your Account</a>`;
        // const html_data = `<h1>Hello from Aniket</h1> <a href="http://aniketgiram.me:8080/v1/userVerification?userId=${encodeURIComponent(decodedData['userId'])}&firstName=${encodeURIComponent(decodedData['firstName'])}">Click here to verify your Account</a>`;
        const html_data = "<h1>Hello from Aniket</h1> This is a verification link";

        console.log("html data", html_data);

        const mail_data = {
            from: "Aniket Giram <email@aniketgiram.me>",
            to: "aniketgiram1@gmail.com",
            subject: 'Hello from Aniket Giram',
            html: html_data
        };
        console.log("preparing mail data", mail_data);
        await mg.messages.create('aniketgiram.me', mail_data);
        console.log("Mail Sent");

        // const durationInMinutes = 2;
        // const currentTime = new Date();
        // const emailExpiryTime = new Date(currentTime.getTime() + (durationInMinutes * 60 * 1000));
        // await EmailTrack.create({ userId: decodedData['userId'], emailStatus: "EMAIL_SENT", email_expiry_time: emailExpiryTime})
        // console.log("Email Sent to User");
    } catch (error) {
        console.log("error in function", error)
    }
});
