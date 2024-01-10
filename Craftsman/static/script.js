document.addEventListener('DOMContentLoaded', function() {
    var stateSelector = document.getElementById('stateSelector');
    var zipCodeTypeSelector = document.getElementById('zipCodeTypeSelector');
    var submitButton = document.getElementById('submitButton');
    var displayArea = document.getElementById('responseArea');
    var requestUrlArea = document.getElementById('requestUrl');

    submitButton.addEventListener('click', function() {
        var selectedState = stateSelector.value;
        var selectedZipCodeType = zipCodeTypeSelector.value;

        if (selectedState && selectedZipCodeType) {
            var requestUrl = `/getCities?state=${selectedState}&zipCodeType=${selectedZipCodeType}`;
            requestUrlArea.textContent = 'GET Request: ' + requestUrl;

            fetch(requestUrl)
                .then(response => response.json())
                .then(data => displayCities(data, displayArea))
                .catch(error => {
                    console.error('Fetch error:', error);
                    displayArea.textContent = 'Error fetching data';
                });
        } else {
            displayArea.textContent = 'Please select both a state and a zip code type.';
            requestUrlArea.textContent = '';
        }
    });

    // displayCities function remains the same
});

// ... existing displayCities function ...


    function displayCities(cities, displayArea) {
        displayArea.innerHTML = ''; // Clear previous content

        var list = document.createElement('ul');
        cities.forEach(city => {
            var listItem = document.createElement('li');
            listItem.textContent = `ID: ${city.id}, Name: ${city.name}, State: ${city.state}`;
            list.appendChild(listItem);
        });

        displayArea.appendChild(list);
    }
;
