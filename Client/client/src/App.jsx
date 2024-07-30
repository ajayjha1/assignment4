import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FlightStatus from './pages/FlightStatus';
import AdminFlightStatus from './pages/AdminFlightStatus';
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <div className='bg-white min-h-screen w-full'>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FlightStatus isAdmin={false} />} />
        <Route path="/admin" element={<AdminFlightStatus isAdmin={true}/>} />
      </Routes>
    </BrowserRouter>
    <Toaster />
    </div>
  );
}

export default App;
