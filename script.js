async function fetchRandomDestination() {
    // Holen des City-Selectors und der ausgewählten Startstadt
    const citySelector = document.getElementById('city-selector');
    const startCity = citySelector.value;

    // Überprüfen, ob eine Startstadt ausgewählt wurde
    if (!startCity) {
        displayRandomDestinationError(); // Fehleranzeige bei fehlender Auswahl
        return;
    }

    // URL für das Abrufen des Fahrplans von der ausgewählten Startstadt
    const stationboardUrl = `https://transport.opendata.ch/v1/stationboard?station=${startCity}&limit=5`;
    try {
        // Abrufen der Fahrplandaten
        const stationboardResponse = await fetch(stationboardUrl);
        const stationboardData = await stationboardResponse.json();

        // Überprüfen, ob Fahrplandaten vorhanden sind
        if (stationboardData && stationboardData.stationboard.length > 0) {
            // Extrahieren aller Zielorte aus den Fahrplandaten
            const allDestinations = stationboardData.stationboard.map(train => train.to);
            // Erstellen einer Liste einzigartiger Zielorte
            const uniqueDestinations = Array.from(new Set(allDestinations));
            // Zufällige Auswahl eines Zielortes aus der Liste
            const randomDestination = uniqueDestinations[Math.floor(Math.random() * uniqueDestinations.length)];

            // URL für das Abrufen der Verbindungen zwischen Startstadt und zufälligem Zielort
            const connectionsUrl = `https://transport.opendata.ch/v1/connections?from=${startCity}&to=${randomDestination}`;
            const connectionsResponse = await fetch(connectionsUrl);
            const connectionsData = await connectionsResponse.json();

            // Überprüfen, ob Verbindungsdaten vorhanden sind
            if (connectionsData && connectionsData.connections && connectionsData.connections.length > 0) {
                // Abrufen der ersten Verbindung und der relevanten Zeiten und Plattformen
                const firstConnection = connectionsData.connections[0];
                const departureTime = new Date(firstConnection.from.departure).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
                const arrivalTime = new Date(firstConnection.to.arrival).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
                const departurePlatform = firstConnection.from.platform || "nicht verfügbar";
                const arrivalPlatform = firstConnection.to.platform || "nicht verfügbar";

                // Anzeige der zufälligen Verbindung
                displayRandomDestination(startCity, departureTime, randomDestination, arrivalTime, departurePlatform, arrivalPlatform);
            } else {
                displayRandomDestinationError(); // Fehleranzeige bei fehlenden Verbindungsdaten
            }
        } else {
            displayRandomDestinationError(); // Fehleranzeige bei fehlenden Fahrplandaten
        }
    } catch (error) {
        console.error('Error fetching data:', error); // Fehlerbehandlung bei Netzwerkfehlern
        displayRandomDestinationError(); // Fehleranzeige bei Netzwerkfehlern
    }
}

function displayRandomDestination(startCity, departureTime, destinationCity, arrivalTime, departurePlatform, arrivalPlatform) {
    // Container für die Anzeige der zufälligen Verbindung
    const container = document.getElementById('random-destination');
    container.innerHTML = `
        <div class="destination-item">
            <div>von: ${startCity}</div>
            <div>Abfahrt: ${departureTime}</div>
            <div>Gleis: ${departurePlatform}</div>
        </div>
        <div class="destination-item">
            <div>nach: ${destinationCity}</div>
            <div>Ankunft: ${arrivalTime}</div>
            <div>Gleis: ${arrivalPlatform}</div>
        </div>
    `;
}

function displayRandomDestinationError() {
    // Container für die Anzeige einer Fehlermeldung bei fehlenden Verbindungsdaten
    const container = document.getElementById('random-destination');
    container.innerHTML = `
        <div class="destination-item">
            <div>Keine Verbindungsdaten verfügbar.</div>
        </div>
    `;
}

// Hinzufügen eines Klick-Event-Listeners zum "Generate Destination"-Button
document.getElementById('generate-destination').addEventListener('click', fetchRandomDestination);
