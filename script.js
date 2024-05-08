const cities = [
    "Bern", "Zürich", "Basel", "Genf", "Lausanne",
    "Luzern", "St. Gallen", "Winterthur", "Lugano", "Biel"
];

async function fetchRandomDestination() {
    const selectedCityIndex = document.getElementById('city-selector').selectedIndex;
    const startCity = cities[selectedCityIndex];

    // Erste API-Abfrage: Abrufen der Abfahrten vom gewählten Startort
    const stationboardUrl = `http://transport.opendata.ch/v1/stationboard?station=${startCity}&limit=5`;
    try {
        const stationboardResponse = await fetch(stationboardUrl);
        const stationboardData = await stationboardResponse.json();
        if (stationboardData && stationboardData.stationboard.length > 0) {
            // Extrahieren der möglichen Ziele aus den Zugfahrten
            const allDestinations = stationboardData.stationboard.map(train => train.to);
            const uniqueDestinations = Array.from(new Set(allDestinations)); // Entfernt Duplikate

            // Wähle ein zufälliges Ziel aus
            const randomDestination = uniqueDestinations[Math.floor(Math.random() * uniqueDestinations.length)];

            // Zweite API-Abfrage: Details zur Verbindung zum gewählten Ziel
            const connectionsUrl = `http://transport.opendata.ch/v1/connections?from=${startCity}&to=${randomDestination}`;
            const connectionsResponse = await fetch(connectionsUrl);
            const connectionsData = await connectionsResponse.json();
            if (connectionsData && connectionsData.connections && connectionsData.connections.length > 0) {
                const firstConnection = connectionsData.connections[0];
                const departureTime = new Date(firstConnection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
                const arrivalTime = new Date(firstConnection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
                const departurePlatform = firstConnection.from.platform || "nicht verfügbar";
                const arrivalPlatform = firstConnection.to.platform || "nicht verfügbar";

                displayRandomDestination(startCity, departureTime, randomDestination, arrivalTime, departurePlatform, arrivalPlatform);
            } else {
                displayRandomDestinationError();
            }
        } else {
            displayRandomDestinationError();
        }
    } catch (error) {
        console.error(`Error fetching data:`, error);
        displayRandomDestinationError();
    }
}

function displayRandomDestination(startCity, departureTime, destinationCity, arrivalTime, departurePlatform, arrivalPlatform) {
    const container = document.getElementById('random-destination');
    container.textContent = `Abfahrtsort: ${startCity}, Abfahrtszeit: ${departureTime}, Gleis: ${departurePlatform}, Ankunftsort: ${destinationCity}, Ankunftszeit: ${arrivalTime}, Gleis: ${arrivalPlatform}.`;
}

function displayRandomDestinationError() {
    const container = document.getElementById('random-destination');
    container.textContent = `Keine Verbindungsdaten verfügbar.`;
}

document.getElementById('generate-destination').addEventListener('click', fetchRandomDestination);

document.getElementById('generate-destination').addEventListener('click', function() {
    let count = 0;
    const interval = setInterval(() => {
        if (count >= 10) { // 10 Bewegungen, ca. 5 Sekunden bei 500ms je Bewegung
            clearInterval(interval);
            fetchRandomDestination(); // Funktion, die nach dem Stoppen der Animation aufgerufen wird
        } else {
            moveButtonRandomly();
            count++;
        }
    }, 500);
});






