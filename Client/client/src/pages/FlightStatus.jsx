import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import EditPopup from '../ComponentFiles/EditPopup';
import SubscribePopup from '../ComponentFiles/SubscribePopup';
import { Header } from '../ComponentFiles/Header';

const FlightStatus = ({ isAdmin, onEdit, onAdd }) => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/flights')
            .then(response => setFlights(response.data))
            .catch(error => console.error('Error fetching flight data:', error));
    }, []);

    const subscribeToNotifications = (flight_id, recipient) => {
        const notification = {
            notification_id: new Date().getTime().toString(),
            flight_id: flight_id,
            message: `You have subscribed to flight ${flight_id} notifications.`,
            timestamp: new Date().toISOString(),
            method: 'App',
            recipient: recipient // This should be the user's FCM token
        };

        axios.post('http://localhost:5000/api/notifications', notification)
            .then(response => console.log(response.data))
            .catch(error => console.error('Error sending notification:', error));
    };

    return (
        <>
        <div className="flex justify-center items-center mb-4 shadow-lg p-4">
                <Header />
            </div>
        <div className="flight-status-div mx-auto p-4 w-full">
            
            <h1 className="text-2xl font-bold mb-4 text-green-700 pl-3">Flight Status {isAdmin && '- Admin'}</h1>
            <table className="min-w-full bg-blue-900 border border-slate-200 text-blue-100">
                <thead className='text-[20px] text-center'>
                    <tr>
                        <th className="py-3 px-6 border-b">Flight ID</th>
                        <th className="py-3 px-6 border-b">Airline</th>
                        <th className="py-3 px-6 border-b">Status</th>
                        <th className="py-3 px-6 border-b">Departure Gate</th>
                        <th className="py-3 px-6 border-b">Arrival Gate</th>
                        <th className="py-3 px-6 border-b">Scheduled Departure</th>
                        <th className="py-3 px-6 border-b">Scheduled Arrival</th>
                        {isAdmin === false && <th className="py-2 px-4 border-b">Subscribe</th>}
                        {isAdmin && <th className="py-2 px-4 border-b">Edit</th>}
                    </tr>
                </thead>
                <tbody className='text-[18px] text-center'>
                    {flights.map(flight => (
                        <tr key={flight.flight_id} className="hover:bg-blue-800">
                            <td className="py-2 px-4 border-b">{flight.flight_id}</td>
                            <td className="py-2 px-4 border-b">{flight.airline}</td>
                            <td className="py-2 px-4 border-b">{flight.status}</td>
                            <td className="py-2 px-4 border-b">{flight.departure_gate}</td>
                            <td className="py-2 px-4 border-b">{flight.arrival_gate}</td>
                            <td className="py-2 px-4 border-b">{new Date(flight.scheduled_departure).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{new Date(flight.scheduled_arrival).toLocaleString()}</td>
                            {isAdmin === false && <td className="py-2 px-4 border-b">
                                <SubscribePopup flight={flight} />
                            </td>}
                            {isAdmin && (
                                <td className="py-2 px-4 border-b">
                                    <EditPopup flight={flight} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAdmin && (
                <div className="mt-4">
                    <Button
                        variant="outline"
                        onClick={onAdd}>
                        Add Flight
                    </Button>
                </div>
            )}
        </div>
        </>
    );
};

export default FlightStatus;