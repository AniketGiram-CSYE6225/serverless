const cloudEvent = require('@google-cloud/functions-framework');
const dotenv = require('dotenv')
dotenv.config()

cloudEvent('verifyUser', cloudEvent => {
    const base64name = cloudEvent.data.message.data;

    var mg = new Mailgun(process.env.MAILGUN_API_KEY);

    const data = base64name
        ? Buffer.from(base64name, 'base64').toString()
        : 'World';

    // const decodedData = JSON.parse(dataBuffer.toString('utf8'));

    sendText('sender@aniketgiram.me',
        [data['username']],
        'Verify USer Email Address',
        function (err) { err && console.log(err) });

    console.log(`Hello, ${name}!`);
});
