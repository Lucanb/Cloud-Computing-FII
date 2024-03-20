import './App.css';
import SigIn from "./pages/authentification/SignIn/SigIn";
import SignUp from "./pages/authentification/SignUp/SignUp";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <div className="App">
            <Router>
                <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<SigIn onLogin={handleLogin} />} />
                    <Route exact path="/signup" element={<SignUp />} />
                    <Route exact path="/home" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;