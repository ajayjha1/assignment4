import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { updateFlightDetails } from "../functions/apiCalls";
import { useToast } from "@/components/ui/use-toast"

const EditPopup = ({ flight }) => {
    const [flightId, setFlightId] = useState(flight.flight_id);
    const [flightStatus, setFlightStatus] = useState(flight.status);
    const [airline, setAirline] = useState(flight.airline);
    const [scheduledArrival, setScheduledArrival] = useState(flight.scheduled_arrival);
    const [scheduledDeparture, setScheduledDeparture] = useState(flight.scheduled_departure);
    const [arrivalGate, setArrivalGate] = useState(flight.arrival_gate);
    const [departureGate, setDepartureGate] = useState(flight.departure_gate);
    const [actualArrival, setActualArrival] = useState(flight.actual_arrival);
    const [actualDeparture, setActualDeparture] = useState(flight.actual_departure);

    const {toast} = useToast();

    const editFlightDetails = async () => {
        const flightDetails = {
            flightId,
            flightStatus,
            airline,
            scheduledArrival,
            scheduledDeparture,
            arrivalGate,
            departureGate,
            actualArrival,
            actualDeparture
        };

        try {
            const response = await updateFlightDetails(flightDetails);
            console.log(response);
            toast({
                title: 'Success',
                description: 'You have successfully edited details.',
                variant: 'success'
              })
        } catch (error) {
            console.error('Error updating flight details:', error);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
              })
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="" className="rounded-[10px] bg-red-500 hover:bg-red-600 text-white">Edit Flight Status</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900">
                <DialogHeader>
                    <DialogTitle>Edit Flight Status</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="flightId" className="text-right">
                            Flight-Id
                        </Label>
                        <Input id="flightId" value={flightId} className="col-span-3" disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="airline" className="text-right">
                            Airline
                        </Label>
                        <Input id="airline" value={airline} className="col-span-3" disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Input id="status" onChange={(e) => setFlightStatus(e.target.value)} value={flightStatus} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departureGate" className="text-right">
                            Departure Gate
                        </Label>
                        <Input id="departureGate" onChange={(e) => setDepartureGate(e.target.value)} value={departureGate} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="arrivalGate" className="text-right">
                            Arrival Gate
                        </Label>
                        <Input id="arrivalGate" onChange={(e) => setArrivalGate(e.target.value)} value={arrivalGate} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scheduledDeparture" className="text-right">
                            Scheduled Departure
                        </Label>
                        <Input id="scheduledDeparture" onChange={(e) => setScheduledDeparture(e.target.value)} value={scheduledDeparture} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scheduledArrival" className="text-right">
                            Scheduled Arrival
                        </Label>
                        <Input id="scheduledArrival" onChange={(e) => setScheduledArrival(e.target.value)} value={scheduledArrival} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={editFlightDetails} className="bg-red-500 hover:bg-red-600 rounded-[10px]">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPopup;
