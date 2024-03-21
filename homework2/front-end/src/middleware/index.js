// import {createContext,useState,useEffect} from "react";
// import {getAuth,onAuthStateChanged} from "firebase/auth";
// export const Context = createContext();
// export function AuthContext({children}){
//     const auth = getAuth();
//     const [user,setUser] = useState();
//     const [loading,setLoading] = useState(true);
//
//     useEffect(() => {
//         let unsubscribe;
//         unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
//             setLoading(false);
//             if(currentUser) {
//                 setUser(currentUser);
//             }
//             else{
//                 setUser(null)
//             }
//         });
//
//         const values = {
//             user:user,
//             setUser:setUser
//         }
//
//         return ()=>{
//             if(unsubscribe) unsubscribe();
//         }
//     }, []);
//     return <Context.Provider value ={values}>
//         {
//             !loading &&
//             children
//         }
//     </Context.Provider>
// }

import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const Context = createContext();

export function AuthContext({ children }) {
    const auth = getAuth();
    const [user, setUser] = useState(null); // Setează userul inițial la null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setUser(currentUser);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const values = {
        user: user,
        setUser: setUser
    };

    return (
        <Context.Provider value={values}>
            {!loading && children}
        </Context.Provider>
    );
}
