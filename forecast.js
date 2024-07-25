const urlsToFetch = ['https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m',
    'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=rain']
document.addEventListener('DOMContentLoaded', () => {
    urlsToFetch.forEach((url, index) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const elementId = `weatherSelect${index}`;
                populateDropdown(data, elementId);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    });
});


function populateDropdown(data, elementId) {

    const selectElement = document.getElementById(elementId);

    if (!selectElement) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }
    let times = {};

    if (data.hourly) {

        if (elementId === "weatherSelect0"){
            times = data.hourly.time;

        }else if (elementId === "weatherSelect1"){
            times = data.hourly.time;
        }

        for (let i = 0; i < times.length; i++) {
            const option = document.createElement('option');
            option.value = i; // store the index as the value
            option.textContent = times[i];
            selectElement.appendChild(option);
        }
        selectElement.addEventListener('change', () => {
            displaySelectedWeather(data, selectElement.value, elementId);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No data available';
        selectElement.appendChild(option);
    }
}

function displaySelectedWeather(data, index, elementId) {
    const selectors = {
        'weatherSelect0': {
            'selectedTime': 'selectedTime0',
            'selectedTemperature': 'selectedTemperature',
            'latitude': 'setLatitude',
            'longitude': 'setLongitude',
            'generationtime_ms': 'setGenerationtime_ms',
            'utc_offset_seconds': 'setUtc_offset_seconds',
            'timezone': 'setTimezone',
            'elevation': 'setElevation',
            'temperature': data.hourly.temperature_2m
        },
        'weatherSelect1': {
            'selectedTime': 'selectedTime1',
            'selectedTemperature': 'selectedRain',
            'latitude': 'setLatitude1',
            'longitude': 'setLongitude1',
            'generationtime_ms': 'setGenerationtime_ms1',
            'utc_offset_seconds': 'setUtc_offset_seconds1',
            'timezone': 'setTimezone1',
            'elevation': 'setElevation1',
            'temperature': data.hourly.rain
        }
    };

    const selectedElements = selectors[elementId];

    if (selectedElements) {
        document.getElementById(selectedElements['selectedTime']).textContent = data.hourly.time[index];
        document.getElementById(selectedElements['selectedTemperature']).textContent = selectedElements['temperature'][index];
        document.getElementById(selectedElements['latitude']).textContent = data.latitude;
        document.getElementById(selectedElements['longitude']).textContent = data.longitude;
        document.getElementById(selectedElements['generationtime_ms']).textContent = data.generationtime_ms.toFixed(2);
        document.getElementById(selectedElements['utc_offset_seconds']).textContent = data.utc_offset_seconds;
        document.getElementById(selectedElements['timezone']).textContent = data.timezone;
        document.getElementById(selectedElements['elevation']).textContent = data.elevation;
    }
}




