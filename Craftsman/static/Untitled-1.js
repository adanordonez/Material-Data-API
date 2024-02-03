
        document.getElementById('propertyForm').addEventListener('submit', function(e) {
            e.preventDefault();
        
            var address1 = document.getElementById('address1').value;
            var address2 = document.getElementById('address2').value;
        
            fetch(`/getPropertyDetails?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);  // Log the received data
        
                // Clear previous content
                document.getElementById('apiResponse').innerHTML = '';
        
                // Create a table
                var table = document.createElement('table');
        
                // Create table header row
                var thead = document.createElement('thead');
                var headerRow = document.createElement('tr');
                var th1 = document.createElement('th');
                th1.textContent = 'Key';
                var th2 = document.createElement('th');
                th2.textContent = 'Value';
                headerRow.appendChild(th1);
                headerRow.appendChild(th2);
                thead.appendChild(headerRow);
                table.appendChild(thead);
        
                // Create table body
                var tbody = document.createElement('tbody');
        
                // Function to handle nested objects and arrays
                function handleNestedData(key, value, tbody) {
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            for (let subKey in item) {
                                handleNestedData(`${key}[${index}].${subKey}`, item[subKey], tbody);
                            }
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        for (let subKey in value) {
                            handleNestedData(`${key}.${subKey}`, value[subKey], tbody);
                        }
                    } else {
                        let row = document.createElement('tr');
        
                        let keyElement = document.createElement('td');
                        keyElement.textContent = key;
        
                        let valueElement = document.createElement('td');
                        valueElement.textContent = typeof value === 'string' ? value : JSON.stringify(value);
        
                        row.appendChild(keyElement);
                        row.appendChild(valueElement);
                        tbody.appendChild(row);
                    }
                }
        
                // Create and append new rows for each key-value pair in the data
                // Create and append new rows for each key-value pair in the data
                        // Create and append new rows for each key-value pair in the data
                        for (let key in data) {
                            handleNestedData(key, data[key], tbody);
                        }
                
                        table.appendChild(tbody);
                        document.getElementById('apiResponse').appendChild(table);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        document.getElementById('apiResponse').textContent = 'Failed to fetch data';
                    });
                });







var map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(40.7128, -74.0060),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}


window.onload = function() {
    initMap();
    initAutocomplete(); // Call autocomplete initialization here if needed
};




function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address1'));
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        
        if (!place.address_components) {
            console.error('No address details available for input:', place.name);
            return;
        }

        // Initialize variables for address components
        var streetAddress = '';
        var city = '';
        var state = '';

        // Extract address components
        place.address_components.forEach(function(component) {
            var types = component.types;
            if (types.includes("street_number") || types.includes("route")) {
                streetAddress += component.long_name + ' ';
            } else if (types.includes("locality")) {
                city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
                state = component.short_name;
            }
        });

        var address1 = streetAddress.trim();
        var address2 = city + ', ' + state;

        fetchPropertyDetails(address1, address2);
    });
}


function fetchPropertyDetails(address1, address2) {
    var geocoder = new google.maps.Geocoder();
    var address = address1 + ' ' + address2;

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            var location = results[0].geometry.location;
            fetch(`/getPropertyDetails?lat=${encodeURIComponent(location.lat())}&lng=${encodeURIComponent(location.lng())}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
                // Set the center of the map to the location
                map.setCenter(location);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('apiResponse').textContent = 'Failed to fetch data';
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


window.onload = function() {
    initMap();
    initAut
}






