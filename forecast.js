let latitude_ = 0.00;
let longitude_ = 0.00;

/**
 * Fetch locations data from API
 * @param{text} input - The user input location
 */

async function searchLocations(input) {
    const locationUrl = "https://geocoding-api.open-meteo.com/v1/search?";
    if (input.length > 0) {
        try {
            const response = await fetch(`${locationUrl}name=${input}`);
            const data = await response.json();
            displayLocation(data.results);
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    } else {
        clearSuggestions();
    }
}


/**
 * Rendering the list of countries
 * @param{object} countries - The list of countries
 */
function displayLocation(countries) {
    const suggestionsList = document.getElementById('suggestions');
    clearSuggestions();
    try {
        countries.forEach(country => {
            const listItem = document.createElement('li');
            listItem.textContent = country.name;
            listItem.onclick = () => selectCountry(country);
            if (latitude_ !== 0.00 && longitude_ !== 0.00) {
                resetInputFields();
            }
            suggestionsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error displaying location:', error);
    }

}

/**
 * Display user's input on html.
 * @param{object} country - User's input
 */
function selectCountry(country) {

    document.getElementById('location').value = country.name;
    clearSuggestions();
    latitude_ = country.latitude;
    longitude_ = country.longitude;
    fetchWeatherData();
}

/**
 Clear suggestions.
 */
function clearSuggestions() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
}

/**
 * Reset temperature and rain data before selecting a new country.
 */
function resetInputFields() {

    // Clear options from dropdowns
    document.getElementById('weatherSelect0').innerHTML =
        '<option class="time-window" id="selectedTime0" value="">Select a time</option>';
    document.getElementById('weatherSelect1').innerHTML =
        '<option class="time-window" id="selectedTime1" value="">Select a time</option>';

    // Reset displayed data
    document.getElementById('selectedTemperature').textContent = '';
    document.getElementById('setLatitude').textContent = '';
    document.getElementById('setLongitude').textContent = '';
    document.getElementById('setGenerationtime_ms').textContent = '';
    document.getElementById('setUtc_offset_seconds').textContent = '';
    document.getElementById('setElevation').textContent = '';
    document.getElementById('selectedRain').textContent = '';
    document.getElementById('setLatitude1').textContent = '';
    document.getElementById('setLongitude1').textContent = '';
    document.getElementById('setGenerationtime_ms1').textContent = '';
    document.getElementById('setUtc_offset_seconds1').textContent = '';
    document.getElementById('setElevation1').textContent = '';
}


/**
 * Fetch temperature and rain data in specific country.
 */
function fetchWeatherData() {
    if (latitude_ !== 0.00 && longitude_ !== 0.00) {
        const urlsToFetch = [
            `latitude=${latitude_}&longitude=${longitude_}&hourly=temperature_2m`,
            `latitude=${latitude_}&longitude=${longitude_}&hourly=rain`
        ];

        const baseURL = 'https://api.open-meteo.com/v1/forecast?';

        urlsToFetch.forEach((url, index) => {
            fetch(`${baseURL}${url}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const elementId = `weatherSelect${index}`;
                    populateDropdown(data, elementId);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        });
    } else {
        console.log('At least one condition is not met.');
    }
}

/**
 * Function populates a dropdown HTML select element with time options.
 * @param{list} data - data
 * @param{string} elementId - Indicates if the data is related to temperature or rain
 */
function populateDropdown(data, elementId) {

    const selectElement = document.getElementById(elementId);

    if (!selectElement) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }
    let times = {};

    if (data.hourly) {

        if (elementId === "weatherSelect0") {
            times = data.hourly.time;

        } else if (elementId === "weatherSelect1") {
            times = data.hourly.time;
        }
        try {
            for (let i = 0; i < times.length; i++) {

                const option = document.createElement('option');
                option.value = i; // store the index as the value
                option.textContent = times[i];
                selectElement.appendChild(option);
            }
        } catch (error) {
            console.error(`Error processing time[${i}]:`, error.message);
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

/**
 * Display fetched temperature and rain data .
 * @param{data} data - Data
 * @param {number} index - Index of the time in the array of all times for the current day
 * @param {string} elementId - Indicates if the data is related to temperature or rain
 */
function displaySelectedWeather(data, index, elementId) {
    const selectors = {
        'weatherSelect0': {
            'selectedTime': 'selectedTime0',
            'selectedTemperature': 'selectedTemperature',
            'latitude': 'setLatitude',
            'longitude': 'setLongitude',
            'generationtime_ms': 'setGenerationtime_ms',
            'utc_offset_seconds': 'setUtc_offset_seconds',
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
        document.getElementById(selectedElements['elevation']).textContent = data.elevation;
    }
}




