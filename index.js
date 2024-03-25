const functions = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
const mailGun = require('mailgun')
dotenv.config()

functions.cloudEvent('verifyUser', cloudEvent => {
    const base64name = cloudEvent.data.message.data;

    var mg = new mailGun(process.env.MAILGUN_API_KEY);

    const data = base64name
        ? Buffer.from(base64name, 'base64').toString()
        : 'World';

    const decodedData = JSON.parse(data);
    console.log(`decoded_data`, decodedData, typeof decodedData)
    // sendText('sender@aniketgiram.me',
    //     [data['username']],
    //     'Verify USer Email Address',
    //     function (err) { err && console.log(err) });

    console.log(`Hello, ${data}!`);
});
