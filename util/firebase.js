var admin = require("firebase-admin");

var serviceAccount = require("../util/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://alkbetna.firebaseio.com"
});




var Messaging = {
    sendNotificaitonToSingleUser(body) {
        // Send a message to the device corresponding to the provided
        // registration token.
        admin.messaging().sendToDevice(body.token, { data: body.data, notification: body.notification }, { priority: 'high' })
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                // console.log('Successfully sent message:', body);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }
};

module.exports = Messaging;