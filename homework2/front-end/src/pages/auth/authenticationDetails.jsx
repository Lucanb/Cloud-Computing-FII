import React from "react";
import {useEffect,useState} from "react";
import {auth} from "../../firebase";
import {onAuthStateChanged, signOut} from "firebase/auth";

const AuthenticationDetails = () =>{
    const [authUser, setAuthUser] = useState(null);
    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user)=>{
            if (user){
                setAuthUser(user);
            }else{
                setAuthUser(null);
            }
        })
    },[]);
    const userSignOut = () =>{
        signOut(auth).then(()=>{
            console.log("sign out successful");
        }).catch(error=>console.log(error));
    }

    return (
        <div>
            {authUser ? (
                <div>
                    <p>Signed In</p>
                    <button onClick={userSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>Signed Out</p>
            )}
        </div>
    );
}

export default AuthenticationDetails;
