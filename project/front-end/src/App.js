import './App.css';
import SigIn from "./pages/authentification/SignIn/SigIn";
import SignUp from "./pages/authentification/SignUp/SignUp";
import { signOut, getAuth } from 'firebase/auth';
import Home from "./pages/Home";
import Index from "./pages/Index";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useState } from "react";
import { Protected } from './middleware/Protected';
import { AuthProvider, AuthContext } from "../src/middleware";
import MusicPage from "./pages/MusicPage";
import ArtistPage from "./pages/ArtistPage";
import NewsComponent from "./components/NewsComponent";
import GalleryComponent from './components/GalleryComponent';
import PartyPage from './pages/PartyPage';
import DJPage from './components/DJPage'
import MessagingPage from './pages/MessagingPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    // setUser(useContext(AuthContext));

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        console.log("The user data was set in App.js!!! ", user);
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setIsAuthenticated(false);
            setUser(null);
            console.log("User signed out successfully!");
        } catch (error) {
            console.log("Error signing out:", error);
        }
    };

    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <NavBar onLogout={handleLogout} />
                    <Routes>
                        <Route exact path="/" element={<Index />} />
                        <Route exact path="/login" element={<SigIn onLogin={handleLogin} />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        <Route path="/home" element={<Protected><Home /></Protected>} />
                        <Route exact path="/party/:id" element={<Protected>< PartyPage/></Protected>} />
                        {/*<Route exact path="/home" element={<Home />} />*/}
                        <Route exact path="/music/:id" element={<Protected><MusicPage /></Protected>} />
                        <Route exact path="/artist/:id" element={<Protected><ArtistPage /></Protected>} />
                        <Route path="/party-dj/:id" element={<Protected><DJPage /></Protected>} />
                        <Route exact path="/news" element={<Protected><NewsComponent /></Protected>} />
                        <Route exact path="/gallery" element={<Protected><GalleryComponent /></Protected>} />
                        <Route path="/messagePage" element={<Protected><MessagingPage /></Protected>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App; 