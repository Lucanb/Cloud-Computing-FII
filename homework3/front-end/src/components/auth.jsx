import React, { useEffect } from 'react';
import axios from "axios";

function VerificationToken({ token }) { // Renamed to follow PascalCase convention
    useEffect(() => {
        if(token) {
            fetchData(token);
        }
    }, [token]);

    const fetchData = async (token) => {
        try {
            const res = await axios.get("https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/login",{
                headers:{
                  Authorization: "Bearer " + token,
                },
            }); // Updated endpoint URL
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <h1>We will see</h1>
        </div>
    );
}

export default VerificationToken;
