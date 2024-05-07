const cityUrls = [
    { city: "Bern", url: "http://transport.opendata.ch/v1/stationboard?station=Bern&limit=420" },
    { city: "Zürich", url: "http://transport.opendata.ch/v1/stationboard?station=Zürich&limit=420" }
];

async function fetchDataForAllCities() {
    for (let cityInfo of cityUrls) {
        try {
            const response = await fetch(cityInfo.url);
            const data = await response.json();
            displayDelays(data, cityInfo.city);
        } catch (error) {
            console.log(`Error fetching data for ${cityInfo.city}:`, error);
            displayError(cityInfo.city);
        }
    }
}

function displayDelays(data, city) {
    const container = document.getElementById('delay-list');
    const cityDiv = document.createElement('div');
    cityDiv.innerHTML = `<h3>Verspätungen in ${city}</h3>`;
    if (data && data.stationboard) {
        data.stationboard.forEach(entry => {
            if (entry.stop) { // Prüfen, ob eine Verspätungsinformation vorhanden ist
                const entryDiv = document.createElement('div');
                entryDiv.textContent = `Zug: ${entry.name}, Ziel: ${entry.to}, Verspätung: ${entry.stop.delay} Minuten`;
                cityDiv.appendChild(entryDiv);
            }
        });
    } else {
        cityDiv.textContent += 'Keine Verspätungsdaten verfügbar.';
    }
    container.appendChild(cityDiv);
}

function displayError(city) {
    const container = document.getElementById('delay-list');
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `Fehler beim Laden der Daten für ${city}.`;
    container.appendChild(errorDiv);
}

document.addEventListener('DOMContentLoaded', fetchDataForAllCities);
