const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const amqp = require('amqplib/callback_api');
// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase-adminsdk.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/flightstatus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const flightSchema = new mongoose.Schema({
  flight_id: String,
  airline: String,
  status: String,
  departure_gate: String,
  arrival_gate: String,
  scheduled_departure: Date,
  scheduled_arrival: Date,
  actual_departure: Date,
  actual_arrival: Date
});

const Flight = mongoose.model('Flight', flightSchema);

const notificationSchema = new mongoose.Schema({
  notification_id: String,
  flight_id: String,
  message: String,
  timestamp: Date,
  method: String,
  recipient: String
});

const Notification = mongoose.model('Notification', notificationSchema);

// RabbitMQ setup
const RABBITMQ_URL = 'amqp://localhost';

amqp.connect(RABBITMQ_URL, (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'flight_notifications';

    channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (msg) => {
      const notification = JSON.parse(msg.content.toString());
      sendNotification(notification);
    }, { noAck: true });

    app.post('/api/notifications', async (req, res) => {
      const notification = req.body;
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(notification)));
      res.send('Notification sent to queue');
    });
  });
});

// Function to send FCM notification
const sendNotification = (notification) => {
  const message = {
    notification: {
      title: 'Flight Status Update',
      body: notification.message
    },
    token: notification.recipient // Assuming recipient is the FCM token
  };

  admin.messaging().send(message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

app.get('/api/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
