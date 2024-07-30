const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// mongoose.connect('mongodb://localhost:27017/flightstatus');
mongoose.connect('mongodb+srv://ajayjha1886:abcd1234@registerloginproject.6yea4ar.mongodb.net/?retryWrites=true&w=majority&appName=RegisterLoginProject')

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



const subscriberSchema = new mongoose.Schema({
    subscriber_emails: [String],
    flight_id: String
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

app.post('/api/subscribe', async (req, res) => {
    console.log("hereeeee")
    const { recipient, flight_id } = req.body;

    if (!recipient || !flight_id) {
        return res.status(400).send('Email and flight ID are required');
    }

    try {
        let subscriber = await Subscriber.findOne({ flight_id });

        if (!subscriber) {
            subscriber = new Subscriber({ flight_id, subscriber_emails: [recipient] });
        } else {
            if (!subscriber.subscriber_emails.includes(recipient)) {
                subscriber.subscriber_emails.push(recipient);
            } else {
                return res.status(400).send('Email already subscribed');
            }
        }

        await subscriber.save();
        res.status(200).send('Subscription successful');
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'ajay.nielit1@gmail.com',
        pass: 'ztup zhoq lpzm oxlp',
    },
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

        // Fetch subscribers of the updated flight
        const subscribers = await Subscriber.findOne({ flight_id: flightId });
        console.log("subscribers here", subscribers)
        if (subscribers && subscribers.subscriber_emails && subscribers.subscriber_emails.length > 0) {
            subscribers.subscriber_emails.forEach(email => {
                const mailOptions = {
                    from: 'ajay.nielit1@gmail.com',
                    to: email,
                    subject: `Update on flight ${flightId}`,
                    text: `The details of flight ${flightId} have been updated. 
                        Status: ${flightStatus || flight.status}, 
                        Airline: ${airline || flight.airline}, 
                        Scheduled Arrival: ${scheduledArrival || flight.scheduled_arrival}, 
                        Scheduled Departure: ${scheduledDeparture || flight.scheduled_departure}, 
                        Arrival Gate: ${arrivalGate || flight.arrival_gate}, 
                        Departure Gate: ${departureGate || flight.departure_gate}, 
                        Actual Arrival: ${actualArrival || flight.actual_arrival}, 
                        Actual Departure: ${actualDeparture || flight.actual_departure}`
                };
        
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email to', email, ':', error);
                    } else {
                        console.log('Email sent to', email, ':', info.response);
                    }
                });
            });
        }
        

        res.status(200).send('Flight details updated successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
