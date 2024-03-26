const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const db_conn = require('./database/index.js');
// const { User, EmailTrack } = require('./model/index.js')

dotenv.config()

functions.cloudEvent('verifyUser', async cloudEvent => {
    try {
        await db_conn.authenticate()
        const base64name = cloudEvent.data.message.data;

        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

        const data = base64name
            ? Buffer.from(base64name, 'base64').toString()
            : 'World';

        const decodedData = JSON.parse(data);
        console.log(`decoded_data`, decodedData, typeof decodedData)

        const user = await User.findOne({ where: { id: decodedData['userId'] } });
        if (user == null) {
            console.log("User Not found");
            return;
        }

        var mail_data = {
            from: "Aniket Giram <email@aniketgiram.me>",
            to: "aniketgiram1@gmail.com",
            subject: 'Hello from Mailgun',
            html: ```Hello ${decodedData['firstName']},
             <h4>Below is the link to verify your account.</h4><br/> 
             <a href="
             http://aniketgiram.me:8080/v1/userVerification?username=${decodedData['username']}&userId=${decodedData['userId']}&firstName=${decodedData['firstname']}"
             >Click here to add your email address to a mailing list</a>```
        };

        mg.messages.create('aniketgiram.me', mail_data)
            .then(msg => console.log(msg))
            .catch(err => console.error(err));

        await EmailTrack.create({ userId: user.id, emailStatus: "EMAIL_SENT" })
        console.log("Email Sent to User");
    } catch (error) {
        console.log("error in function", error)
    }
});
