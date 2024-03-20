import './App.css';
import SigIn from "./pages/authentification/SignIn/SigIn";
import SignUp from "./pages/authentification/SignUp/SignUp";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Auth from "../src/components/auth"
// import AuthenticationDetails from "./pages/authentification/authenticationDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const token = 'Bearer 1234';
function App() {
    // useEffect(() => {
    //     // Facem cererea către ruta /login pentru a obține lista de todos
    //     axios.get("http://localhost:5000/login")
    //         .then(response => {
    //             // Afișăm răspunsul întreg în consolă pentru a verifica structura
    //             console.log('Response from server:', response.data);
    //             // Extragem lista de todos din răspuns și o afișăm în consolă
    //             console.log('List of Todos:', response.data.todos);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);

    return (
        <div className="App">
            <Router>
                <NavBar/> {/* Afișăm Navbar în afara componentei Routes */}
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/login" element={<SigIn/>}/>
                    <Route exact path="/signup" element={<SignUp/>}/>
                    <Route exact path="/auth" element={<Auth token={token}/>}/>
                </Routes>
            </Router>
            {/*<AuthenticationDetails/>*/}
        </div>
    );
}

export default App;