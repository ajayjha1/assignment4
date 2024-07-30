import axios from 'axios';

export const getFlights = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/flights');
        return response.data;
    } catch (error) {
        console.error('Error fetching flight data:', error);
        return error;
    }
}

export const subscribeToUpdates = async ({flight_id, recipient}) => {
    try {
        const response = await axios.post('http://localhost:5000/api/subscribe', { flight_id, recipient });
        return response.data;
    } catch (error) {
        console.error('Error subscribing to updates:', error);
        return error;
    }
}

export const updateFlightDetails = async (flightDetails) => {
    try {
        const response = await axios.put('http://localhost:5000/api/updateFlightDetails', flightDetails);
        return response.data;
    } catch (error) {
        console.error('Error updating flight details:', error);
        return error;
    }
}
