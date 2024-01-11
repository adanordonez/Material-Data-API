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

    // ... existing event listener ...

    function displayValuationResponse(data) {
       
        const responseContainer = document.getElementById('valuationResponse');
        responseContainer.innerHTML = ''; // Clear previous content
    
        // Function to create a table for costs
        function createCostTable(costs, title) {
            const table = document.createElement('table');
            responseContainer.appendChild(document.createTextNode(title));
            responseContainer.appendChild(table);
    
            const header = table.createTHead();
            const headerRow = header.insertRow();
            ['Title', 'Equipment', 'Labor', 'Materials', 'Total'].forEach(text => {
                const cell = headerRow.insertCell();
                cell.textContent = text;
            });
    
            const tbody = table.createTBody();
            costs.forEach(item => {
                const row = tbody.insertRow();
                ['title', 'equipment', 'labor', 'materials', 'total'].forEach(key => {
                    const cell = row.insertCell();
                    cell.textContent = item[key] !== undefined ? item[key] : '-';
                });
            });
        }
    
        // Check and create tables for direct and indirect costs
        if (data.directCosts) {
            createCostTable(data.directCosts, "Direct Costs");
        }
        if (data.indirectCosts) {
            createCostTable(data.indirectCosts, "Indirect Costs");
        }
    
        // Display other values
        if (data.totalAppraisedValue !== undefined) {
            responseContainer.appendChild(document.createTextNode(`Total Appraised Value: ${data.totalAppraisedValue}`));
            responseContainer.appendChild(document.createElement('br'));
        }
        if (data.costToReplace !== undefined) {
            responseContainer.appendChild(document.createTextNode(`Cost to Replace: ${data.costToReplace}`));
            responseContainer.appendChild(document.createElement('br'));
        }
        if (data.documentId !== undefined) {
            responseContainer.appendChild(document.createTextNode(`Document ID: ${data.documentId}`));
        }
    }
        
// ... existing fetch request in the event listener ...

var responseContainer = document.getElementById('responseContainer');

fetch('/performValuation', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-Key': '71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())  // Convert response to JSON
.then(rawJson => {
    
    console.log("Received data:", data);  // Log the received data
    var data = JSON.parse(rawJson);  // Parse the received data
    displayValuationResponse(data);  // Call the function to process and display the data
})
.catch(error => {
    console.error('Error:', error);
    document.getElementById('valuationResponse').textContent = 'Error: ' + error.message;
});
});