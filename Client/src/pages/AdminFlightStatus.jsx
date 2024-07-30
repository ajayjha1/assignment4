import React from 'react';
import FlightStatus from './FlightStatus';

const AdminFlightStatus = () => {
    const editFlight = (flight_id) => {
        // Implement the edit flight functionality
        console.log(`Editing flight ${flight_id}`);
    };

    const addFlight = () => {
        // Implement the add flight functionality
        console.log('Adding new flight');
    };

    return (
        <FlightStatus isAdmin={true} onEdit={editFlight} onAdd={addFlight} />
    );
};

export default AdminFlightStatus;
