import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./index";

export function Protected({children}){
    const user = useContext(AuthContext);
    console.log("Protected:", user);
    if(user == null){
        return <Navigate to="/login" replace/>
    }else{
        return children;
    }
}