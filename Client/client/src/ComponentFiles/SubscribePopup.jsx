import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "../components/ui/input"
  import { Label } from "../components/ui/label"
  import { Button } from "../components/ui/button"
  import { useState } from "react"
  import { useToast } from "@/components/ui/use-toast"
import { subscribeToUpdates } from "../functions/apiCalls"

  const SubscribePopup = ({flight}) => {
    const { toast } = useToast()
    const [email, setEmail] = useState("")

    const subscribeToFlightUpdates = async (flight_id, recipient) => {
        subscribeToUpdates({flight_id, recipient})
        .then((response) => {
          console.log(response);
          toast({
            title: 'Success',
            description: 'You have subscribed to flight updates.',
            variant: 'success'
          })
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          })
        })
    }
    
    return (
      <Dialog >
        <DialogTrigger asChild>
          <Button variant="" className="rounded-[10px] bg-white hover:bg-gray-200 text-blue-900">Subcribe to Flight updates</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-slate-900">
          <DialogHeader>
            <DialogTitle>Subscribe to Flight: {flight.flight_id}</DialogTitle>
            <DialogDescription>
             Subscribe to this flight updates
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailid" className="text-right">
                Enter Email Id
              </Label>
              <Input onChange={(e) => setEmail(e.target.value)} id="flightId" type="email" value={email} className="col-span-3" />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="airline" className="text-right">
                Airline
              </Label>
              <Input id="username" value={airline} className="col-span-3" />
            </div> */}
          </div>
          <DialogFooter>
            <Button onClick={() => subscribeToFlightUpdates(flight.flight_id, email)} type="submit" className="bg-emerald-500 hover:bg-emerald-600 rounded-[10px]">Subscribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default SubscribePopup;