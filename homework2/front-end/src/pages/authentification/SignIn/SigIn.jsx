import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./SignIn.css"

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    let [isLoggedIn, setIsLoggedIn] = useState(false); // Stare pentru a indica dacă utilizatorul s-a autentificat cu succes

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredentials.user);

            const idToken = await userCredentials.user.getIdToken();
            console.log("User token:", idToken);

            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            const data = await response.json();
            console.log("Response from server:", data);

            if (response.status === 200) {  //poate sa vad daca ce a trimis sv e valid (oare status-ul poate fi falsificat??)
                setIsLoggedIn(true);
                isLoggedIn = true;
            }

        } catch (error) {
            console.error("Error signing in:", error.message);
            setError("Authentication failed. Please check your credentials.");
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/home" />;
    }

    return (
        <div className={"sign-in-container"}>
            <form onSubmit={signIn}>
                <h1>Log In</h1>
                <input type={"email"} placeholder={"Enter your email"} value={email} onChange={e => setEmail(e.target.value)} />
                <input type={"password"} placeholder={"Enter your password"} value={password} onChange={e => setPassword(e.target.value)} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type={"submit"}>Log In</button>
            </form>
        </div>
    );
};

export default SignIn;
