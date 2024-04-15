const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const db_conn = require('./database/index.js');
const { User, EmailTrack } = require('./model/index.js')

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

        const user = await User.findOne({ where: { id: decodedData['userId'] } });
        if (user == null) {
            console.log("User Not found");
            return;
        }
        console.log("creating html data");

        const html_data = `Hello ${decodedData['firstName']}, <h4>Below is the link to verify your account.</h4><br/><a href="${process.env.DOMAIN}/userVerification?username=${encodeURIComponent(decodedData['username'])}&userId=${encodeURIComponent(decodedData['userId'])}&firstName=${encodeURIComponent(decodedData['firstName'])}">Click here to verify your Account</a>`;

        console.log("html data", html_data);

        const mail_data = {
            from: "Aniket Giram <email@aniketgiram.me>",
            to: decodedData['username'],
            subject: 'Hello from Aniket Giram',
            html: html_data
        };
        console.log("preparing mail data", mail_data);
        mg.messages.create('aniketgiram.me', mail_data)
            .then(msg => console.log(msg))
            .catch(err => console.error(err));
        const durationInMinutes = process.env.EMAIL_LINK_EXPIRY_DURATION;
        const currentTime = new Date();
        const emailExpiryTime = new Date(currentTime.getTime() + (durationInMinutes * 60 * 1000));
        await EmailTrack.create({ userId: user.id, emailStatus: "EMAIL_SENT", email_expiry_time: emailExpiryTime})
        console.log("Email Sent to User");
    } catch (error) {
        console.log("error in function", error)
    }
});
