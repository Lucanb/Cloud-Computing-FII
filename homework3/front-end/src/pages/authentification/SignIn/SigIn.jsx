import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./SignIn.css"

const SignIn = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredentials.user);

            const idToken = await userCredentials.user.getIdToken();
            console.log("User token:", idToken);

            const response = await fetch("https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            const data = await response.json();
            console.log("Response from server:", data);

            if (response.status === 200) {
                setIsLoggedIn(true);
                onLogin(userCredentials.user); // Call the onLogin function with user data
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
