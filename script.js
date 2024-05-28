document.addEventListener("DOMContentLoaded", () => {
    const path = document.getElementById('trainPath');
    const dropdownGroup = document.getElementById('dropdownGroup');
    const train1 = document.getElementById('train1');
    const train2 = document.getElementById('train2');
    const train3 = document.getElementById('train3');
    const citySelector = document.getElementById('city-selector');

    // Function to position the dropdown
    const positionDropdown = () => {
        const pathLength = path.getTotalLength();
        const point = path.getPointAtLength(pathLength * 0.2); // Adjust the multiplier as needed

        // Move the dropdown a bit to the left by subtracting from point.x
        const xOffset = 300; // Adjust this value to move more or less to the left
        dropdownGroup.setAttribute("transform", `translate(${point.x - xOffset}, ${point.y})`);
    };

    // Initial positioning
    positionDropdown();

    // Reposition on window resize
    window.addEventListener('resize', positionDropdown);

    // Function to pause and resume train animation
    const pauseTrain = (train) => {
        train.setAttribute("begin", "indefinite");
    };

    const resumeTrain = (train) => {
        train.beginElement();
    };

    // Pause trains initially
    pauseTrain(document.getElementById('train1Anim'));
    pauseTrain(document.getElementById('train2Anim'));
    pauseTrain(document.getElementById('train3Anim'));

    // Resume train on dropdown selection
    citySelector.addEventListener('change', () => {
        resumeTrain(document.getElementById('train1Anim'));
        resumeTrain(document.getElementById('train2Anim'));
        resumeTrain(document.getElementById('train3Anim'));
    });
});

const cities = [
    "Bern", "Zürich", "Basel", "Genf", "Lausanne",
    "Luzern", "St. Gallen", "Winterthur", "Lugano", "Biel"
];

document.addEventListener("DOMContentLoaded", () => {
    const citySelector = document.getElementById('city-selector');
    citySelector.addEventListener('change', () => {
        citySelector.classList.add('selected');
    });
});

async function fetchRandomDestination() {
    const citySelector = document.getElementById('city-selector');
    const startCity = citySelector.value;

    const stationboardUrl = `http://transport.opendata.ch/v1/stationboard?station=${startCity}&limit=5`;
    try {
        const stationboardResponse = await fetch(stationboardUrl);
        const stationboardData = await stationboardResponse.json();
        if (stationboardData && stationboardData.stationboard.length > 0) {
            const allDestinations = stationboardData.stationboard.map(train => train.to);
            const uniqueDestinations = Array.from(new Set(allDestinations));

            const randomDestination = uniqueDestinations[Math.floor(Math.random() * uniqueDestinations.length)];

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
    container.textContent = `Keine Verbindungsdaten verfügbar.`;
}

document.getElementById('generate-destination').addEventListener('click', fetchRandomDestination);
