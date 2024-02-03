const express = require('express');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const app = express();
const port = 3005;
var push = require("web-push");


app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.get('/getUsers', async (req, res) => {
    try {
      const usersSnapshot = await admin.firestore().collection('user').get();
  
      const usersData = [];
      usersSnapshot.forEach((doc) => {
        console.log(doc.id)
        usersData.push({ id: doc.id, ...doc.data() });
      });
  
      res.json(usersData);
    } catch (error) {
      console.error('Error getting user info:', error);
      res.status(500).send('Internal Server Error');
    }
});


let vapidKeys = {
    publicKey: 'BE-C8n3HUtNZdDnjLHSSrGpJ8OFb5jG-nhaYGOjXWRra7WBTRiRcO6S-BN2IqRComcpaXKQKJ6Uw2zdknhweOM8',
    privateKey: 'jhEU3U86aAljugtqFAx0REIif5g0hKYv1Not6FxERWI'
}

app.post('/sendNotif', async (req, res) => {
  push.setVapidDetails('mailto:test@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey)

  let sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/f8v3vf6SpU0:APA91bFH0x1N6UXvqLUZmW1A-fzWmoqVdOUBSd8DuMUpSA7OUZOTdaU0PdHcw7dnXMyDnQpeguoICRHZ_4qD45tvmAFYf3TA7RwgSTlY5Kf7_Vp1QoB8oA74q7mzQdbL-OYU9Ne8za5f","expirationTime":null,"keys":{"p256dh":"BCqXATCUziFoPBVlxfN1K_9SICAJiGfSfhhuTRFvCu_yY0AACi2Z-DjeFQ0wpZurHqCY-3Fw9BE9GFMuRdtcgSk","auth":"7OGz5mx0rWyFuecsATBmzQ"}}

  push.sendNotification(sub, 'test message')
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});