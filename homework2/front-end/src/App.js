import './App.css';
import SigIn from "./pages/authentification/SignIn/SigIn";
import SignUp from "./pages/authentification/SignUp/SignUp";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import AuthenticationDetails from "./pages/authentification/authenticationDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";

function App() {
    useEffect(() => {
        axios.get("http://localhost:5000/api/todos")
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="App">
            <Router>
                <NavBar /> {/* Afișăm Navbar în afara componentei Routes */}
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<SigIn />} />
                    <Route exact path="/signup" element={<SignUp />} />
                </Routes>
            </Router>
            {/*<AuthenticationDetails/>*/}
        </div>
    );
}

export default App;