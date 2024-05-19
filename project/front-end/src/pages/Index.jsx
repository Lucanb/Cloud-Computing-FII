// src/pages/Index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Index() {
    return (
        <div>
            <h1>Bine ați venit pe pagina de index!</h1>
            <p>Aceasta este pagina de pornire a aplicației.</p>
            <ul>
                <li>
                    <Link to="/login">Autentificare</Link>
                </li>
                <li>
                    <Link to="/signup">Înregistrare</Link>
                </li>
                <li>
                    <Link to="/home">Acasă</Link>
                </li>
            </ul>
        </div>
    );
}

export default Index;