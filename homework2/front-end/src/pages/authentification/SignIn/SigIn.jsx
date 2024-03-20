import React, {useState} from "react";
import  {auth}  from "../../../firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredentials.user);

            const idToken = await userCredentials.user.getIdToken();
            console.log("User token:", idToken);

            const response = await fetch("http://localhost:5000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            const data = await response.json();
            console.log("Response from server:", data);

        } catch (error) {
            console.error("Error signing in:", error.message);
        }
    };
    return(
        <div className={"sign-in-container"}>
        <form onSubmit={signIn}>
        <h1>Log In</h1>
            <input type={"email"} placeholder={"Enter your email"} value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type={"password"} placeholder={"Enter your password"} value={password} onChange={e=>setPassword(e.target.value)}/>
            <button type={"submit"}>Log In</button>
        </form>
        </div>
    );
};


export default SignIn