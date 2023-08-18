import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/home/Home";
import Payment from "./pages/payment/Payment";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/payment" element={<Payment/>} />
      </Routes>
      <ToastContainer/>
    </Router>
  );
}

export default App;
