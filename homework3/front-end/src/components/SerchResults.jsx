
export const SearchResult = ({ result }) => {
    return (
        <div
            className="search-result"
            onClick={(e) => alert(`You selected ${result}!`)} //de aici daca apasam de poate da redirect poate la pagina specifica.
        >
            {result}
        </div>
    );
};