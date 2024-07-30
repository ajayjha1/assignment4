const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/flightstatus');

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

app.get('/api/flights', async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (err) {
        res.status(500).send(err);
    }
});

const notificationSchema = new mongoose.Schema({
    notification_id: String,
    flight_id: String,
    message: String,
    timestamp: Date,
    method: String,
    recipient: [String]
});

const Notification = mongoose.model('Notification', notificationSchema);

app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).send(err);
    }
});

const subscriberSchema = new mongoose.Schema({
    subscriber_emails: [String],
    flight_id: String
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

app.post('/api/subscribe', async (req, res) => {
    const { email, flight_id } = req.body;

    if (!email || !flight_id) {
        return res.status(400).send('Email and flight ID are required');
    }

    try {
        let subscriber = await Subscriber.findOne({ flight_id });

        if (!subscriber) {
            subscriber = new Subscriber({ flight_id, subscriber_emails: [email] });
        } else {
            if (!subscriber.subscriber_emails.includes(email)) {
                subscriber.subscriber_emails.push(email);
            } else {
                return res.status(400).send('Email already subscribed');
            }
        }

        await subscriber.save();
        res.status(200).send('Subscription successful');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/api/updateFlightDetails', async (req, res) => {
    console.log("Updating flight details...");
    const {
        flightId,
        flightStatus,
        airline,
        scheduledArrival,
        scheduledDeparture,
        arrivalGate,
        departureGate,
        actualArrival,
        actualDeparture
    } = req.body;

    try {
        const flight = await Flight.findOne({ flight_id: flightId });
        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Updating the flight details with provided values from the request body
        flight.status = flightStatus || flight.status;
        flight.airline = airline || flight.airline;
        flight.scheduled_arrival = scheduledArrival || flight.scheduled_arrival;
        flight.scheduled_departure = scheduledDeparture || flight.scheduled_departure;
        flight.arrival_gate = arrivalGate || flight.arrival_gate;
        flight.departure_gate = departureGate || flight.departure_gate;
        flight.actual_arrival = actualArrival || flight.actual_arrival;
        flight.actual_departure = actualDeparture || flight.actual_departure;

        await flight.save();  // Save the updated flight details back to the database

        res.status(200).send('Flight details updated successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
