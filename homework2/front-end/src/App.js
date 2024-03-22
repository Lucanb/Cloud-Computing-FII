import './App.css';
import SigIn from "./pages/authentification/SignIn/SigIn";
import SignUp from "./pages/authentification/SignUp/SignUp";
import Home from "./pages/Home";
import Index from "./pages/Index"
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
// import { Protected } from './middleware/Protected';
import {AuthContext} from "../src/middleware/index"
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
                <AuthContext> {/* Încapsulează întreaga aplicație în contextul de autentificare */}
                    <Routes>
                        <Route exact path="/" element={<Index  />} />
                        <Route exact path="/login" element={<SigIn onLogin={handleLogin} />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        {/*<Route path="/home" element={<Protected><Home /></Protected>} />*/}
                        <Route exact path="/home" element={<Home />} />
                    </Routes>
                </AuthContext>
            </Router>
        </div>
    );
}

export default App;