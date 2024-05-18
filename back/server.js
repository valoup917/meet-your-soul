const express = require('express');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const app = express();
const port = 3005;
var push = require("web-push");
const jwt = require("jsonwebtoken")
require('dotenv').config()

app.use(express.json());
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.get('/ping', async (req, res) => {
  res.send("Ok")
})

app.post('/login', async (req, res) => {
  console.log("login -------------------------------")
  const email = req.body.email;
  const uid = req.body.uid;
  const password = req.body.password;
  user = { email: email, uid: uid, password: password }
  console.log(user)
  const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken });
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    console.log("token null")
    return res.status(401).send("Unauthorized")
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).send(("Invalid token"))
    req.user = user
    next()
  })
}

app.get('/getUsers', authenticateToken, async (req, res) => {
  console.log("getUsers -------------------------------")
  try {
      const usersSnapshot = await admin.firestore().collection('users').get();
    
      const usersData = [];
      usersSnapshot.forEach((doc) => {
        if (req.user.email !== doc.data().email)
          usersData.push({ id: doc.id, ...doc.data() });
      });
  
      res.json(usersData);
    } catch (error) {
      console.error('Error getting user info:', error);
      res.status(500).send(error);
    }
});

app.get('/getUsersWithoutSecurity', async (req, res) => {
  console.log("getUsersWithoutSecurity -------------------------------")
  try {
    const usersSnapshot = await admin.firestore().collection('users').get();

    const usersData = [];
    usersSnapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });

    res.json(usersData);
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).send(error);
  }
});

app.get('/getGroupRequests', authenticateToken, async (req, res) => {
  console.log("getGroupRequests -------------------------------")
  try {
    const usersSnapshot = await admin.firestore().collection('users');
    const usersSnapshotUid = await usersSnapshot.doc(req.user.uid);
    const usersSnapshotUidGet = await usersSnapshotUid.get();
    const group_request = usersSnapshotUidGet.data().group_request

       const result = [];
       for (let i = 0; i < group_request.length; i += 2) {
        if (i + 1 < group_request.length) {
          const usersSnapshotUid = await usersSnapshot.doc(group_request[i]);
          const usersSnapshotUidGet = await usersSnapshotUid.get();
          const username = usersSnapshotUidGet.data().username

          const pair = {
            username: username,
            message: group_request[i + 1],
            uid: group_request[i]
          };
          result.push(pair);
        }
      }
       res.json(result);
     } catch (error) {
       console.error('Error getting user group request:', error);
       res.status(500).send(error);
     }
 });

app.get('/isNotificationAuthorized', authenticateToken, async (req, res) => {
 console.log("isNotificationAuthorized -------------------------------")
  const userUid = req.user.uid;
  try {
    const userDocRef = admin.firestore().collection('users').doc(userUid);
    const userDocSnapshot = await userDocRef.get();
    console.log(userDocSnapshot.data().notification)
    if (userDocSnapshot.data().notification !== null) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
})

app.post('/joinGroup', authenticateToken, async (req, res) => {
  const targetUid = req.body.userUidTarget
  const usersSnapshot = await admin.firestore().collection('users');
  const usersSnapshotUid = await usersSnapshot.doc(req.user.uid);
  const usersSnapshotUidGet = await usersSnapshotUid.get();
  const group_request = usersSnapshotUidGet.data().group_request

  console.log(usersSnapshotUidGet.data())

  if (usersSnapshotUidGet.data().group === null) {
    const usersRequestSnapshotUid = await usersSnapshot.doc(targetUid);
    const usersRequestSnapshotUidGet = await usersRequestSnapshotUid.get();
    const newGroupId = usersRequestSnapshotUidGet.data().group;
    usersSnapshotUid.update({ group: newGroupId })
    const groupDocRef = admin.firestore().collection('groups').doc(newGroupId);
    await groupDocRef.update({
      users: admin.firestore.FieldValue.arrayUnion(req.user.uid)
    });
  } else {
    const tmpPreviousGroup = usersSnapshotUidGet.data().group
    console.log(tmpPreviousGroup)
    console.log("tmpPreviousGroup")
  }

  const acceptIndex = group_request.findIndex((userUid) => userUid == targetUid)
  group_request.splice(acceptIndex, 1)
  group_request.splice(acceptIndex, 1)

  usersSnapshotUid.update({ group_request: group_request })
  res.send("Group joined");
});

app.post('/sendNotif', authenticateToken, async (req, res) => {
  push.setVapidDetails('mailto:test@gmail.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
  const subscritpion = req.body.subscritpion
  const message = req.body.message
  const targetUid = req.body.targetUid

  const userDocRef = admin.firestore().collection('users').doc(targetUid);
  const userDocSnapshot = await userDocRef.get();

  var group_request = userDocSnapshot.data().group_request
  if (!group_request.includes(req.user.uid)) {
    group_request.push(req.user.uid);
    group_request.push(message);
    await userDocRef.update({ group_request: group_request });
  }
  push.sendNotification(subscritpion, message).then(response => {
    res.send("Message sent");
    console.log(response)
  })
  .catch(error => {
    console.log(error)
    res.status(405).send(error);
  });
});

app.post('/sendGroupNotif', authenticateToken, async (req, res) => {
  push.setVapidDetails('mailto:test@gmail.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
  const subscritpion = req.body.subscritpion
  const message = req.body.message

  push.sendNotification(subscritpion, message).then(response => {
    res.send("Message sent");
    console.log(response)
  }).catch(error => {
      console.log(error)
      res.status(405).send(error);
    });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});