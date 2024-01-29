document.addEventListener('DOMContentLoaded', function() {
    // Debugging: Log the elements to ensure they are correctly identified
    console.log('Form:', document.querySelector('form'));
    console.log('Address input:', document.querySelector('[name="address"]'));
    console.log('City input:', document.querySelector('[name="city"]'));
    console.log('State input:', document.querySelector('[name="state"]'));

    const form = document.querySelector('form');
    const addressInput = document.querySelector('[name="address"]');
    const cityInput = document.querySelector('[name="city"]');
    const stateInput = document.querySelector('[name="state"]');
    const responseContainer = document.getElementById('responseContainer');

    function prepareSubmit(event) {
        event.preventDefault();
    
        const addressInput = document.querySelector('[name="address"]');
        const cityInput = document.querySelector('[name="city"]');
        const stateInput = document.querySelector('[name="state"]');
        const address1Input = document.querySelector('[name="address1"]');
        const address2Input = document.querySelector('[name="address2"]');
    
        let address1 = addressInput.value.trim();
        let address2 = cityInput.value.trim() + ', ' + stateInput.value.trim();
    
        address1Input.value = address1;
        address2Input.value = address2;
    
        // Now you can submit the form
        event.target.submit();
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Print input values to the console
        console.log("Address:", addressInput.value);
        console.log("City:", cityInput.value);
        console.log("State:", stateInput.value);

        let address1 = addressInput.value.trim();
        let address2 = cityInput.value.trim() + ', ' + stateInput.value.trim();

        fetch(`/getPropertyDetails?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`)
        .then(response => response.json())
        .then(data => {
            responseContainer.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => {
            console.error('Error:', error);
            responseContainer.textContent = 'Failed to fetch data';
        });
    });
});