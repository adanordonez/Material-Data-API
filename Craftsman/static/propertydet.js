var map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(40.7128, -74.0060),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address1'));
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        
        if (!place.geometry) {
            console.error('Autocomplete\'s returned place contains no geometry');
            return;
        }

        var address1 = ''; // street address
        var address2 = ''; // city, state

        // Iterate over the place details to extract the street address and city, state
        place.address_components.forEach(function(component) {
            var types = component.types;
            if (types.includes('route') || types.includes('street_number')) {
                address1 += component.long_name + ' ';
            } else if (types.includes('locality') || types.includes('administrative_area_level_1')) {
                address2 += component.long_name + ' ';
            }
        });

        address1 = address1.trim();
        address2 = address2.trim();

        // Update the map to the new location
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // Fetch property details using the formatted address
        fetchPropertyDetails(address1, address2);
    });
}

function fetchPropertyDetails(address1, address2) {
    fetch(`/getPropertyDetails?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('apiResponse').textContent = 'Failed to fetch data';
    });
}

window.onload = function() {
    initMap();
    initAutocomplete();
}

