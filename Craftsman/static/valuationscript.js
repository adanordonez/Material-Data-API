document.getElementById('valuationForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    var data = {
        homeType: document.getElementById('homeType').value,
        cityId: parseInt(document.getElementById('cityId').value, 10),
        singleFamilyHome: {
            corners: parseInt(document.getElementById('corners').value, 10),
            livingArea: parseInt(document.getElementById('livingArea').value, 10),
            stories: parseInt(document.getElementById('stories').value, 10),
            yearBuilt: parseInt(document.getElementById('yearBuilt').value, 10),
            exteriorWallType: document.getElementById('exteriorWallType').value,
            homeQuality: {
                foundationQuality: document.getElementById('foundationQuality').value,
                exteriorWallsQuality: document.getElementById('exteriorWallsQuality').value,
                exteriorFinishQuality: document.getElementById('exteriorFinishQuality').value,
                windowsAndDoorsQuality: document.getElementById('windowsAndDoorsQuality').value,
                roofSoffitQuality: document.getElementById('roofSoffitQuality').value,
                interiorFinishQuality: document.getElementById('interiorFinishQuality').value,
                floorFinishQuality: document.getElementById('floorFinishQuality').value,
                bathroomsQuality: document.getElementById('bathroomsQuality').value,
                plumbingElectricalQuality: document.getElementById('plumbingElectricalQuality').value,
                kitchenQuality: document.getElementById('kitchenQuality').value
            },
            homeCondition: {
                foundationCondition: document.getElementById('foundationCondition').value,
                exteriorWallsCondition: document.getElementById('exteriorWallsCondition').value,
                exteriorFinishCondition: document.getElementById('exteriorFinishCondition').value,
                windowsAndDoorsCondition: document.getElementById('windowsAndDoorsCondition').value,
                roofSoffitCondition: document.getElementById('roofSoffitCondition').value,
                interiorFinishCondition: document.getElementById('interiorFinishCondition').value,
                floorFinishCondition: document.getElementById('floorFinishCondition').value,
                bathroomsCondition: document.getElementById('bathroomsCondition').value,
                plumbingElectricalCondition: document.getElementById('plumbingElectricalCondition').value,
                kitchenCondition: document.getElementById('kitchenCondition').value
            },
            heatingCooling: {
                heatingCoolingType: document.getElementById('heatingCoolingType').value
            }
        }
    };

    fetch('/performValuation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': '71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe'
        },
        body: JSON.stringify(data)

    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('valuationResponse').textContent = JSON.stringify(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
