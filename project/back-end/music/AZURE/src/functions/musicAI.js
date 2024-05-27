const levenshtein = require('fast-levenshtein');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findMatchingSongs(playlist, searchWords, callback) {
    let matches = [];

    playlist.forEach(item => {
        const [link, title] = item;
        const lowerTitle = title.toLowerCase();
        let matchCount = 0;
        let minDistance = Infinity;

        searchWords.forEach(word => {
            const wordLower = word.toLowerCase();
            const distance = levenshtein.get(lowerTitle, wordLower);

            if (lowerTitle.includes(wordLower)) {
                matchCount++;
                minDistance = Math.min(minDistance, 0); // potrivire exactă
            } else if (distance <= 3 && distance > 0) { // ajustați pragul după necesități
                matchCount++;
                minDistance = Math.min(minDistance, distance);
            }
        });

        if (matchCount > 0) {
            const matchRatio = matchCount / searchWords.length;
            matches.push({ link: link, title: title, distance: minDistance, matchRatio: matchRatio });
        }
    });

    // Dacă nu găsim niciun cuvânt, căutăm în funcție de lungimea titlului
    if (matches.length === 0) {
        playlist.forEach(item => {
            const [link, title] = item;
            const lowerTitle = title.toLowerCase();
            let minDistance = Infinity;

            searchWords.forEach(word => {
                const wordLower = word.toLowerCase();
                const distance = levenshtein.get(lowerTitle, wordLower);
                minDistance = Math.min(minDistance, distance);
            });

            matches.push({ link: link, title: title, distance: minDistance, matchRatio: 0 });
        });

        // Sortăm melodiile după distanța Levenshtein (cea mai mică distanță = cea mai bună potrivire)
        matches.sort((a, b) => a.distance - b.distance);

        // Grupăm melodiile după distanță și amestecăm fiecare grup
        let groupedMatches = matches.reduce((acc, song) => {
            acc[song.distance] = acc[song.distance] || [];
            acc[song.distance].push(song);
            return acc;
        }, {});

        let sortedAndShuffledMatches = [];
        Object.keys(groupedMatches).forEach(distance => {
            sortedAndShuffledMatches = sortedAndShuffledMatches.concat(shuffle(groupedMatches[distance]));
        });

        callback(sortedAndShuffledMatches.length > 0 ? sortedAndShuffledMatches : null);
    } else {
        // Sortăm melodiile după raportul de potrivire și apoi după distanța Levenshtein (cea mai mică distanță = cea mai bună potrivire)
        matches.sort((a, b) => {
            if (b.matchRatio === a.matchRatio) {
                return a.distance - b.distance;
            }
            return b.matchRatio - a.matchRatio;
        });

        // Grupăm melodiile după distanță și amestecăm fiecare grup
        let groupedMatches = matches.reduce((acc, song) => {
            acc[song.distance] = acc[song.distance] || [];
            acc[song.distance].push(song);
            return acc;
        }, {});

        let sortedAndShuffledMatches = [];
        Object.keys(groupedMatches).forEach(distance => {
            sortedAndShuffledMatches = sortedAndShuffledMatches.concat(shuffle(groupedMatches[distance]));
        });

        callback(sortedAndShuffledMatches.length > 0 ? sortedAndShuffledMatches : null);
    }
}

module.exports = {
    shuffle,
    findMatchingSongs
};
