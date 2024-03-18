import logo from './logo.svg';
import './App.css';
import SigIn from "./components/auth/SigIn";
import SignUp from "./components/auth/SignUp";
import AuthenticationDetails from "./components/auth/authenticationDetails";
import axios from 'axios';
import {useEffect} from "react";
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
        <SigIn />
        <SignUp />
        <AuthenticationDetails/>
    </div>
  );
}

export default App;
