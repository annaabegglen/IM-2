document.addEventListener("DOMContentLoaded", () => {
    const citySelector = document.getElementById('city-selector');
    citySelector.addEventListener('change', () => {
        citySelector.classList.add('selected');
    });
});

async function fetchRandomDestination() {
    const citySelector = document.getElementById('city-selector');
    const startCity = citySelector.value;

    const stationboardUrl = `https://transport.opendata.ch/v1/stationboard?station=${startCity}&limit=5`;
    try {
        const stationboardResponse = await fetch(stationboardUrl);
        const stationboardData = await stationboardResponse.json();
        if (stationboardData && stationboardData.stationboard.length > 0) {
            const allDestinations = stationboardData.stationboard.map(train => train.to);
            const uniqueDestinations = Array.from(new Set(allDestinations));

            const randomDestination = uniqueDestinations[Math.floor(Math.random() * uniqueDestinations.length)];

            const connectionsUrl = `https://transport.opendata.ch/v1/connections?from=${startCity}&to=${randomDestination}`;
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
    const container = document.getElementById('random-destination');
    container.innerHTML = `
        <div class="destination-item">
            <div>Keine Verbindungsdaten verfügbar.</div>
        </div>
    `;
}

document.getElementById('generate-destination').addEventListener('click', fetchRandomDestination);
