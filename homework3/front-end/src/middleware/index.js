import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext(null); // Set initial value to null

export function AuthProvider({ children }) {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setUser(currentUser); // Set user state
        });
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={user}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
