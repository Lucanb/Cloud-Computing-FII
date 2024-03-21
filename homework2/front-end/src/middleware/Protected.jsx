import { Route, Navigate } from 'react-router-dom'; // Adaugă importul pentru Route
import { useContext } from 'react';
import { Context } from './index';

export function Protected({ children, ...rest }) { // Adaugă restul de proprietăți în componenta Protected
    const { user } = useContext(Context);

    // Verifică starea de autentificare și redirecționează utilizatorii dacă nu sunt autentificați
    if (!user) {
        return <Navigate to="/login" />; // sau orice altă acțiune dorită pentru redirecționare
    }

    // Dacă utilizatorul este autentificat, afișează elementul/ruta protejată
    return <Route {...rest}>{children}</Route>; // Utilizează restul de proprietăți și afișează copiii
}