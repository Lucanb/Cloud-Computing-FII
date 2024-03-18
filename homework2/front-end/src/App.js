import SigIn from "./pages/auth/Login/SigIn";
import SignUp from "./pages/auth/Register/SignUp";
import Home from "./pages/app/Home";
import NavBar from "./components/NavBar";
import AuthenticationDetails from "./pages/auth/authenticationDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';
import {useEffect} from "react";
function App() {

    return (
        <div className="App">
            <SigIn />
            <SignUp />
            <AuthenticationDetails/>
        </div>
    );
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
                <NavBar />
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