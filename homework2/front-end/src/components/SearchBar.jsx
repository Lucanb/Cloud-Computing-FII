import React, { useState } from "react";
import "./searchBar.css";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearchResults }) { // Adăugăm proprietatea onSearchResults
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch(`https://jsonplaceholder.typicode.com/users?q=${value}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const filteredResults = data.filter(
                    (user) =>
                        user.name &&
                        user.name.toLowerCase().includes(value.toLowerCase())
                );
                onSearchResults(filteredResults); // Apelăm funcția onSearchResults cu rezultatele căutării
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className={"search-bar-container"}>
            <div className={"input-wrapper"}>
                <FaSearch id={"search-icon"} />
                <input
                    placeholder={"Type to search ..."}
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </div>
    );
}
