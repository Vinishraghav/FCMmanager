const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // handle escaped \n
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
  }),
});

// ✅ POST endpoint to send notification
app.post('/sendNotification', async (req, res) => {
  try {
    const { friendFcmToken, title, body } = req.body;

    if (!friendFcmToken || !title || !body) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: friendFcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
