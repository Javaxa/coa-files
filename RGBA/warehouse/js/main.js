let sampleData = [];
let appliedFilters = {};        
let map;
let markers = [];
let isIdentifyingMisplaced = false;
let misplacedSamplesData = [];
let zoneButtons;
let currentStep = 1;
let isSelectingPointOnMap = false;
let tempMarker = null;
let savedFormState = {};

const headers = ['Description', 'Stid', 'Zone', 'Northing', 'Easting', 'DH', 'Depth', 'Jar/Bag', 'Shelf', 'Weight'];

function parseCSV(text) {
    const lines = text.trim().split('\n');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((object, header, index) => {
            object[header.trim()] = values[index] ? values[index].trim() : '';
            return object;
        }, {});
    });
}

function displayDebugInfo(message) {
    const debugDiv = document.getElementById('debugInfo');
    debugDiv.innerHTML += `<p>${new Date().toLocaleTimeString()} - ${message}</p>`;
}

function initMap() {
    // Define different map layers
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; BGS'
    });

    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; RRCM BGS'
    });

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; RRCM BGS'
    });

    // Initialize the map with the default layer
    map = L.map('map', {
        layers: [satelliteLayer]
    }).setView([0, 0], 2);

    map.on('click', function(e) {
        if (isSelectingPointOnMap) {
            handleMapClick(e);
        } else if (!isIdentifyingMisplaced && !e.originalEvent.target.classList.contains('leaflet-interactive')) {
            resetTableFilter();
        }
    });




    // Base layers for switching
    const baseLayers = {
        "Satellite": satelliteLayer,
        "Topographic": topoLayer,
        "Street": streetLayer,
    };

    // Add layer control to the map
    L.control.layers(baseLayers).addTo(map);
}

function convertUTMToLatLng(northing, easting) {
    const utm = "+proj=utm +zone=11 +datum=WGS84";
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
    const result = proj4(utm, wgs84, [parseFloat(easting), parseFloat(northing)]);
    return [result[1], result[0]];
}

function createPopupContent(sample) {
    let content = '<table class="table table-sm">';
    headers.forEach(header => {
        content += `<tr><th>${header}</th><td>${sample[header]}</td></tr>`;
    });
    content += '</table>';
    return content;
}

function createCustomIcon(dh, color) {
const textColor = color === 'white' ? 'black' : 'white';
return L.divIcon({
className: 'custom-div-icon',
html: `<div style="background-color: ${color}; color: ${textColor};">${dh}</div>`,
iconSize: [11, 11],
iconAnchor: [5, 5],
popupAnchor: [0, -11],
});
}


// Update the updateMap function to handle click events
function updateMap(samples, dhGroups, misplacedSamples) {
// Clear existing markers
markers.forEach(marker => map.removeLayer(marker));
markers = [];

const uniquePoints = new Set();

samples.forEach(sample => {
    if (sample.Northing && sample.Easting) {
        const latLng = convertUTMToLatLng(sample.Northing, sample.Easting);
        const key = `${latLng[0]},${latLng[1]},${sample.DH}`;
        
        if (!uniquePoints.has(key)) {
            uniquePoints.add(key);

            let color = 'white';  // Default color
            if (isIdentifyingMisplaced) {
                const misplacedSample = misplacedSamplesData.find(ms => ms.Stid === sample.Stid);
                if (misplacedSample) {
                    color = misplacedSample.color;  // This will be 'red' or 'blue'
                } else {
                    color = 'green';  // Correctly placed samples
                }
            }

            

        const marker = L.marker(latLng, { icon: createCustomIcon(sample.DH, color) }).addTo(map);
        marker.bindTooltip(`DH: ${sample.DH}<br>STID: ${sample.Stid}`);
            marker.bindPopup(createPopupContent(sample));
            
            // Only add click event if not in misplaced samples mode
            if (!isIdentifyingMisplaced) {
                marker.on('click', function(e) {
                    L.DomEvent.stopPropagation(e);
                    filterTableByDH(sample.DH);
                });
            }

            markers.push(marker);
        }
        }
    })



if (markers.length > 0) {
const group = new L.featureGroup(markers);
map.fitBounds(group.getBounds());
}

}

// Update the CSS for .custom-div-icon
const style = document.createElement('style');
style.textContent = `
.custom-div-icon {
    width: 20px;
    height: 20px;
    background-color: white;
    border: 1px solid black;
    text-align: center;
    font-size: 7px;
    line-height: 9px;
    font-weight: bold;
}
`;
document.head.appendChild(style);

function resetMap() {
    isIdentifyingMisplaced = false;
    misplacedSamplesData = [];
    updateMap(sampleData, {}, []);
    searchSample();
}





function identifyMisplacedSamples() {
    isIdentifyingMisplaced = true;
    const dhGroups = {};

    sampleData.forEach(sample => {
        if (sample.DH && sample.DH.trim() !== '') {
            if (!dhGroups[sample.DH]) {
                dhGroups[sample.DH] = {};
            }
            if (!dhGroups[sample.DH][sample.Shelf]) {
                dhGroups[sample.DH][sample.Shelf] = [];
            }
            dhGroups[sample.DH][sample.Shelf].push(sample);
        }
    });

    misplacedSamplesData = [];

Object.entries(dhGroups).forEach(([dh, shelfGroups]) => {
const shelves = Object.keys(shelfGroups);
if (shelves.length > 1) {
    const counts = shelves.map(shelf => shelfGroups[shelf].length);
    const maxCount = Math.max(...counts);
    const maxCountOccurrences = counts.filter(count => count === maxCount).length;

    if (maxCountOccurrences === shelves.length && counts[0] === 1) {
        // All samples are on different shelves (one per shelf)
        const allSamples = shelves.flatMap(shelf => shelfGroups[shelf]);
        const correctSampleIndex = Math.floor(Math.random() * allSamples.length);
        const correctSample = allSamples[correctSampleIndex];
        const correctShelf = correctSample.Shelf;

        allSamples.forEach((sample, index) => {
            if (index !== correctSampleIndex) {
                sample.color = 'red';
                sample.correctShelf = correctShelf;
                misplacedSamplesData.push(sample);
            }
        });
    } else if (maxCountOccurrences > 1) {
        // Multiple shelves with max count (blue case)
        shelves.forEach(shelf => {
            if (shelfGroups[shelf].length === maxCount) {
                shelfGroups[shelf].forEach(sample => {
                    sample.color = 'blue';
                    sample.correctShelf = shelf; // Keep on current shelf
                    misplacedSamplesData.push(sample);
                });
            }
        });
    } else {
        // Clear majority - mark others as red
        const correctShelf = shelves.find(shelf => shelfGroups[shelf].length === maxCount);
        shelves.forEach(shelf => {
            if (shelf !== correctShelf) {
                shelfGroups[shelf].forEach(sample => {
                    sample.color = 'red';
                    sample.correctShelf = correctShelf;
                    misplacedSamplesData.push(sample);
                });
            }
        });
    }
}
});

displayMisplacedSamples(misplacedSamplesData, dhGroups);
updateMap(sampleData, dhGroups, misplacedSamplesData); // Refresh the map
showPlacementGuideButton();
}

function showPlacementGuide() {
const guideBody = document.getElementById('placementGuideBody');
guideBody.innerHTML = '';

const dhGroups = {};
misplacedSamplesData.forEach(sample => {
if (!dhGroups[sample.DH]) {
    dhGroups[sample.DH] = [];
}
dhGroups[sample.DH].push(sample);
});

Object.entries(dhGroups).forEach(([dh, samples]) => {
const guideItem = document.createElement('div');
guideItem.className = `guide-item ${samples[0].color}`;

if (samples[0].color === 'red') {
    // Red case: clear misplacements
    guideItem.innerHTML = `
        <strong>DH: ${dh}</strong><br>
        ${samples.map(sample => `
            Sample <span style="color: #dc3545; font-weight: bold;">${sample.Stid}</span> should be moved from shelf <strong>${sample.Shelf}</strong> to <strong>${sample.correctShelf}</strong>
        `).join('<br>')}
    `;
} else if (samples[0].color === 'blue') {
    // Blue case: randomly choose a target shelf
    const shelfGroups = {};
    samples.forEach(sample => {
        if (!shelfGroups[sample.Shelf]) {
            shelfGroups[sample.Shelf] = [];
        }
        shelfGroups[sample.Shelf].push(sample);
    });
    
    const allShelves = Object.keys(shelfGroups);
    const targetShelf = allShelves[Math.floor(Math.random() * allShelves.length)];
    
    guideItem.innerHTML = `<strong>DH: ${dh}</strong><br>`;
    Object.entries(shelfGroups).forEach(([shelf, shelfSamples]) => {
        if (shelf !== targetShelf) {
            guideItem.innerHTML += `
                Samples <span style="color: #007bff; font-weight: bold;">${shelfSamples.map(s => s.Stid).join(', ')}</span> should be moved from shelf <strong>${shelf}</strong> to <strong>${targetShelf}</strong><br>
            `;
        }
    });
}

guideBody.appendChild(guideItem);
});

if (misplacedSamplesData.length === 0) {
guideBody.innerHTML = '<p>No samples need to be moved.</p>';
}

const placementGuideModal = new bootstrap.Modal(document.getElementById('placementGuideModal'));
    placementGuideModal.show();
}

function displayMisplacedSamples(misplacedSamples, dhGroups) {
    const resultBody = document.getElementById('resultBody');
    resultBody.innerHTML = '';

    let affectedSamples = sampleData.filter(sample => 
        dhGroups[sample.DH] && Object.keys(dhGroups[sample.DH]).length > 1
    );

    // Sort the affected samples by DH
    affectedSamples.sort((a, b) => {
        const dhA = parseFloat(a.DH);
        const dhB = parseFloat(b.DH);

        if (isNaN(dhA) && isNaN(dhB)) return 0;
        if (isNaN(dhA)) return 1;
        if (isNaN(dhB)) return -1;
        return dhA - dhB;
    });

    let redCount = 0;
    let blueCount = 0;

    affectedSamples.forEach(sample => {
        const row = document.createElement('tr');
        let sampleColor = 'green';
        const misplacedSample = misplacedSamples.find(ms => ms.Stid === sample.Stid);

        if (misplacedSample) {
            sampleColor = misplacedSample.color;
        }

        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = sample[header] || '';
            if (header === 'DH' || header === 'Shelf') {
                cell.style.cssText = `color: ${sampleColor} !important; font-weight: bold !important;`;
            }
            row.appendChild(cell);
        });

        // Count the misplaced samples
        if (sampleColor === 'red') {
            redCount++;
        } else if (sampleColor === 'blue') {
            blueCount++;
        }

        // Add delete button
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteSample(sample['Stid']));
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        resultBody.appendChild(row);
    });

    if (affectedSamples.length === 0) {
        resultBody.innerHTML = '<tr><td colspan="11">No misplaced samples found</td></tr>';
    }

    // Update the map with the filtered data and color information
    updateMap(affectedSamples, dhGroups, misplacedSamples);

    // Calculate the total number of misplaced samples
    const totalMisplaced = redCount + blueCount;

    const sampleCounter = document.getElementById('sampleCounter');
    sampleCounter.textContent = `Number of Misplaced Samples: ${totalMisplaced}`;
    showPlacementGuideButton();
}

function countSamplesPerShelf() {
const counts = {};
sampleData.forEach(sample => {
if (sample.Shelf) {
    counts[sample.Shelf] = (counts[sample.Shelf] || 0) + 1;
}
});
return counts;
}

function updateShelfCountDisplay(selectedShelf = null) {
const shelfCounts = countSamplesPerShelf();
const shelfCountDisplay = document.getElementById('shelfCountDisplay');
const sampleDetailView = document.getElementById('sampleDetailView');
shelfCountDisplay.innerHTML = '';
sampleDetailView.style.display = 'none';
shelfCountDisplay.style.display = 'block';

if (selectedShelf) {
const samples = sampleData.filter(sample => sample.Shelf === selectedShelf);

const backButton = document.createElement('button');
backButton.className = 'btn btn-link back-arrow';
backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
backButton.onclick = () => updateShelfCountDisplay();
shelfCountDisplay.appendChild(backButton);

const sampleCount = document.createElement('div');
sampleCount.className = 'number-of-samples';
sampleCount.textContent = `Samples on shelf ${selectedShelf}: ${samples.length}`;
shelfCountDisplay.appendChild(sampleCount);

const samplesWrapper = document.createElement('div');
samplesWrapper.className = 'samples-wrapper';

samples.forEach(sample => {
    const sampleItem = document.createElement('div');
    sampleItem.className = 'sample-item';
    sampleItem.innerHTML = `
        <div class="sample-stid">${sample.Stid}</div>
        <div class="sample-dh">${sample.DH}</div>
    `;
    sampleItem.onclick = () => showSampleDetails(sample, selectedShelf);
    samplesWrapper.appendChild(sampleItem);
});

shelfCountDisplay.appendChild(samplesWrapper);
} else {
// Existing code for showing all shelves
// Group shelves by letter
const groupedShelves = {};
Object.entries(shelfCounts).forEach(([shelf, count]) => {
    const shelfLetter = shelf[0];
    if (!groupedShelves[shelfLetter]) {
        groupedShelves[shelfLetter] = [];
    }
    groupedShelves[shelfLetter].push({ shelf, count });
});

// Create and append shelf groups
Object.entries(groupedShelves).sort().forEach(([letter, shelves]) => {
    const shelfGroup = document.createElement('div');
    shelfGroup.className = 'shelf-group';
    
    const groupHeader = document.createElement('h3');
    const totalCount = shelves.reduce((sum, { count }) => sum + count, 0);
    groupHeader.textContent = `Shelf ${letter} (Total: ${totalCount})`;
    shelfGroup.appendChild(groupHeader);

    const shelvesContainer = document.createElement('div');
    shelvesContainer.className = 'shelves-container';

    shelves.sort((a, b) => b.shelf.localeCompare(a.shelf)).forEach(({ shelf, count }) => {
        const shelfItem = document.createElement('div');
        shelfItem.className = 'shelf-count-item';
        shelfItem.innerHTML = `
            <div class="shelf-name">${shelf}</div>
            <div class="sample-count">${count}</div>
        `;
        shelfItem.onclick = () => updateShelfCountDisplay(shelf);
        shelvesContainer.appendChild(shelfItem);
    });

    shelfGroup.appendChild(shelvesContainer);
    shelfCountDisplay.appendChild(shelfGroup);
});
}
}

function showSampleDetails(sample, selectedShelf) {
const shelfCountDisplay = document.getElementById('shelfCountDisplay');
const sampleDetailView = document.getElementById('sampleDetailView');

shelfCountDisplay.style.display = 'none';
sampleDetailView.style.display = 'block';

sampleDetailView.innerHTML = `
<button class="btn btn-link back-arrow" onclick="updateShelfCountDisplay('${selectedShelf}')">
    <i class="fas fa-arrow-left"></i>
</button>
<h4 class="mb-4" style="text-align: center;">Sample: ${sample.Stid}</h4>
<div class="row">
    <div class="col-md-4">
        <div class="sample-detail-card">
            <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
            <p><strong>Northing:</strong> ${sample.Northing}</p>
            <p><strong>Easting:</strong> ${sample.Easting}</p>
            <p><strong>Depth:</strong> ${sample.Depth} ft</p>
            <p><strong>Zone:</strong> ${sample.Zone}</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="sample-detail-card">
            <h3><i class="fas fa-box"></i> Storage</h3>
            <p><strong>Jar/Bag:</strong> ${sample['Jar/Bag']}</p>
            <p><strong>Shelf:</strong> ${sample.Shelf}</p>
            <p><strong>Weight:</strong> ${sample.Weight} kg</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="sample-detail-card">
            <h3><i class="fas fa-file-alt"></i> Identification</h3>
            <p><strong>Description:</strong> ${sample.Description}</p>
            <p><strong>STID:</strong> ${sample.Stid}</p>
            <p><strong>DH:</strong> ${sample.DH}</p>
        </div>
    </div>
</div>
`;
}

function openShelfInventoryModal() {
updateShelfCountDisplay();
const shelfInventoryModal = new bootstrap.Modal(document.getElementById('shelfInventoryModal'));
shelfInventoryModal.show();
}

function filterTableByDH(dh) {
    if (!isIdentifyingMisplaced) {
        let filteredSamples = sampleData.filter(sample => sample.DH === dh);
        filteredSamples = sortSamplesByDepth(filteredSamples);
        updateTable(filteredSamples);
        updateSampleCounter(filteredSamples.length);
        filterMapByDH(dh);

        // Clear existing filters
        appliedFilters = {};

        // Apply the DH filter
        appliedFilters['DH'] = dh;

        // Display the applied filter
        displayAppliedFilters();
    }
}

function startPointSelection() {
    isSelectingPointOnMap = true;
    const registerModal = document.getElementById('registerModal');
    const modalDialog = registerModal.querySelector('.modal-dialog');
    const modalContent = registerModal.querySelector('.modal-content');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    // Add these classes to allow map interaction
    registerModal.classList.add('map-selection-mode');
    modalDialog.classList.add('map-selection-dialog');
    modalContent.classList.add('map-selection-content');
    
    // Make backdrop transparent and disable pointer events
    if (modalBackdrop) {
        modalBackdrop.style.opacity = '0';
        modalBackdrop.style.pointerEvents = 'none';
    }
    
    // Prevent modal from closing when clicking outside
    registerModal.addEventListener('click', preventModalClose);
    
    map.getContainer().style.cursor = 'crosshair';
}

function preventModalClose(event) {
    if (event.target === this) {
        event.stopPropagation();
    }
}

function handleMapClick(e) {
    if (!isSelectingPointOnMap) return;

    const latlng = e.latlng;
    const utm = "+proj=utm +zone=11 +datum=WGS84";
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
    const utmCoords = proj4(wgs84, utm, [latlng.lng, latlng.lat]);
    
    const northing = Math.round(utmCoords[1]);
    const easting = Math.round(utmCoords[0]);
    
    document.getElementById('registerNorthing').value = northing;
    document.getElementById('registerEasting').value = easting;
    
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    
    tempMarker = L.marker(latlng).addTo(map);
    
    map.getContainer().style.cursor = '';
    
    const registerModal = document.getElementById('registerModal');
    const modalDialog = registerModal.querySelector('.modal-dialog');
    const modalContent = registerModal.querySelector('.modal-content');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    // Remove the classes after selection
    registerModal.classList.remove('map-selection-mode');
    modalDialog.classList.remove('map-selection-dialog');
    modalContent.classList.remove('map-selection-content');
    
    // Restore backdrop opacity and pointer events
    if (modalBackdrop) {
        modalBackdrop.style.opacity = '';
        modalBackdrop.style.pointerEvents = '';
    }
    
    // Remove the event listener that prevents modal closing
    registerModal.removeEventListener('click', preventModalClose);
    
    isSelectingPointOnMap = false;
}



// Update the initMapPointSelection function
function initMapPointSelection() {
    const selectPointOnMapButton = document.getElementById('selectPointOnMap');
    if (selectPointOnMapButton) {
        selectPointOnMapButton.addEventListener('click', startPointSelection);
    } else {
        console.warn("'Select Point on Map' button not found. Make sure it exists in the HTML.");
    }
}


function updateNavigation(step) {
    currentStep = step;
    const navTabs = [
        document.getElementById('step1-tab'),
        document.getElementById('step2-tab'),
        document.getElementById('step3-tab')
    ];
    navTabs.forEach((tab, index) => {
        const stepContent = document.getElementById(`step${index + 1}`);
        if (index + 1 === step) {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            stepContent.classList.add('show', 'active');
        } else {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            stepContent.classList.remove('show', 'active');
        }
    });

    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const registerSampleButton = document.getElementById('registerSampleButton');

    prevStepBtn.style.display = step > 1 ? 'inline-block' : 'none';
    nextStepBtn.style.display = step < 3 ? 'inline-block' : 'none';
    registerSampleButton.style.display = step === 3 ? 'inline-block' : 'none';
}









function filterMapByDH(dh) {
// Clear existing markers
markers.forEach(marker => map.removeLayer(marker));
markers = [];

const filteredSamples = sampleData.filter(sample => sample.DH === dh);

filteredSamples.forEach(sample => {
if (sample.Northing && sample.Easting) {
    const latLng = convertUTMToLatLng(sample.Northing, sample.Easting);
    const marker = L.marker(latLng, { icon: createCustomIcon(sample.DH, 'white') }).addTo(map);
    marker.bindTooltip(`DH: ${sample.DH}<br>STID: ${sample.Stid}`);
    marker.bindPopup(createPopupContent(sample));
    markers.push(marker);
}
});

if (markers.length > 0) {
const group = new L.featureGroup(markers);
map.fitBounds(group.getBounds());
}
}

function sortSamplesByDH(samples) {
return samples.sort((a, b) => {
const dhA = parseFloat(a.DH);
const dhB = parseFloat(b.DH);

if (isNaN(dhA) && isNaN(dhB)) return 0;
if (isNaN(dhA)) return 1;
if (isNaN(dhB)) return -1;
return dhA - dhB;
});
}

function countSamplesPerShelf() {
const shelfCounts = {};
sampleData.forEach(sample => {
const shelf = sample.Shelf;
if (shelf) {
    if (shelfCounts[shelf]) {
        shelfCounts[shelf]++;
    } else {
        shelfCounts[shelf] = 1;
    }
}
});
return shelfCounts;
}

// Update the sample counter function
function updateSampleCounter(count) {
const sampleCounter = document.getElementById('sampleCounter');
sampleCounter.textContent = `Samples available: ${count}`;
}



function loadData() {
const timestamp = new Date().getTime();
fetch(`data.csv?t=${timestamp}`)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
})
.then(text => {
    sampleData = parseCSV(text);
    sampleData = sortSamplesByDH(sampleData); // Sort the data initially
    populateFilterOptions();
    searchSample(); // This will now update both the table and the map
    updateShelfCountDisplay();
})
.catch(error => {
    console.error('Error loading the CSV file:', error);
    displayDebugInfo(`Error loading CSV: ${error.message}`);
});
}

function populateFilterOptions() {
    const uniqueValues = (key) => [...new Set(sampleData.map(item => item[key]))].sort();

    const populateSelect = (id, values) => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Any</option>';
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    };

    populateSelect('filterZone', uniqueValues('Zone'));
    populateSelect('filterDH', uniqueValues('DH'));
    populateSelect('filterDepth', uniqueValues('Depth'));
    populateSelect('filterJarBag', uniqueValues('Jar/Bag'));
    populateSelect('filterShelf', uniqueValues('Shelf'));
}




function updateTable(samples) {
const resultBody = document.getElementById('resultBody');
resultBody.innerHTML = '';

samples.forEach((sample, index) => {
const row = document.createElement('tr');
headers.forEach(header => {
    const cell = document.createElement('td');
    cell.textContent = sample[header] || '';
    cell.classList.add('editable');
    cell.addEventListener('dblclick', () => makeEditable(cell, sampleData.indexOf(sample), header));
    row.appendChild(cell);
});

// Add delete button
const deleteCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.className = 'btn btn-outline-danger btn-sm';
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', () => deleteSample(sample['Stid']));
deleteCell.appendChild(deleteButton);
row.appendChild(deleteCell);

resultBody.appendChild(row);
});

if (samples.length === 0) {
resultBody.innerHTML = '<tr><td colspan="11">No matching samples found</td></tr>';
}
}


function searchSample() {
const searchTerm = searchInput.value.trim().toLowerCase();
const searchType = document.querySelector('input[name="searchType"]:checked').value;

let filteredSamples = sampleData.filter(sample => {
    const matchesSearchTerm = searchType === 'stid' 
        ? sample['Stid'].toLowerCase().includes(searchTerm)
        : sample['DH'].toLowerCase().includes(searchTerm);

    const matchesFilters = Object.keys(appliedFilters).every(key => {
        if (!appliedFilters[key]) return true;
        return sample[key] === appliedFilters[key];
    });

    return matchesSearchTerm && matchesFilters;
});

if (appliedFilters['DH']) {
    filteredSamples = sortSamplesByDepth(filteredSamples);
} else {
    filteredSamples = sortSamplesByDH(filteredSamples);
}

updateTable(filteredSamples);

const sampleCounter = document.getElementById('sampleCounter');
if (!isIdentifyingMisplaced) {
    sampleCounter.textContent = `Samples available: ${filteredSamples.length}`;
}

updateMap(filteredSamples);
updateShelfCountDisplay();
}

// Replace the existing searchSample function with this updated version
window.searchSample = searchSample;





function sortSamplesByDepth(samples) {
return samples.sort((a, b) => {
const depthA = parseFloat(a.Depth);
const depthB = parseFloat(b.Depth);
return depthA - depthB; // This will sort from lowest to highest
});
}

function saveFormState() {
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    savedFormState = Object.fromEntries(formData.entries());
    savedFormState.currentStep = currentStep;
}

function restoreFormState() {
    const form = document.getElementById('registerForm');
    Object.keys(savedFormState).forEach(key => {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'radio') {
                const radio = form.querySelector(`input[name="${key}"][value="${savedFormState[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                input.value = savedFormState[key];
            }
        }
    });
    if (savedFormState.currentStep) {
        updateNavigation(parseInt(savedFormState.currentStep));
    }
}




function makeEditable(cell, sampleIndex, header) {
const originalContent = cell.textContent;
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const originalContentInput = document.getElementById('originalContent');
const newContentInput = document.getElementById('newContent');
const saveEditButton = document.getElementById('saveEditButton');
const modalBody = document.querySelector('#editModal .modal-body');

originalContentInput.value = originalContent;

let dropdownOptions;
let select;

if (header === 'Zone') {
dropdownOptions = ['', '1', '2', '3', '4', '5', '6'];
} else if (header === 'Jar/Bag') {
dropdownOptions = ['', 'Jar', 'Bag'];
} else if (header === 'Shelf') {
dropdownOptions = ['', 'A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4', 'H1', 'H2', 'H3', 'H4', 'I1', 'I2', 'I3', 'I4', 'J1', 'J2', 'J3', 'J4', 'K1', 'K2', 'K3', 'K4', 'L1', 'L2', 'L3', 'L4'];
}

if (dropdownOptions) {
select = document.createElement('select');
select.className = 'form-select';
dropdownOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option === '' ? 'Select' : option;
    if (option === originalContent) {
        optionElement.selected = true;
    }
    select.appendChild(optionElement);
});
modalBody.querySelector('.mb-3:nth-child(2)').replaceChild(select, newContentInput);
} else {
newContentInput.value = originalContent;
if (modalBody.contains(select)) {
    modalBody.querySelector('.mb-3:nth-child(2)').replaceChild(newContentInput, select);
}
}

function saveEdit() {
const newValue = dropdownOptions ? select.value : newContentInput.value;
if (confirm('Are you sure you want to save the changes?')) {
    cell.textContent = newValue;
    const stid = sampleData[sampleIndex]['Stid'];
    const sampleToUpdate = sampleData.find(sample => sample['Stid'] === stid);
    if (sampleToUpdate) {
        sampleToUpdate[header] = newValue;
        updateCSV();
        searchSample();
    }
    editModal.hide();
}
}

saveEditButton.onclick = saveEdit;

editModal.show();

// Reset the modal when it's hidden
document.getElementById('editModal').addEventListener('hidden.bs.modal', function () {
if (select) {
    modalBody.querySelector('.mb-3:nth-child(2)').replaceChild(newContentInput, select);
}
newContentInput.value = '';
}, { once: true });
}




function showPlacementGuideButton() {
    const container = document.getElementById('placementGuideButtonContainer');
    if (container) {
        container.style.display = 'block';
    }
}

function hidePlacementGuideButton() {
    const container = document.getElementById('placementGuideButtonContainer');
    if (container) {
        container.style.display = 'none';
    }
}







function updateCSV() {
    const csvContent = [
        headers.join(','),
        ...sampleData.map(sample => headers.map(header => sample[header]).join(','))
    ].join('\n');

    fetch('update-csv.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvContent }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayDebugInfo('CSV updated successfully');
        } else {
            displayDebugInfo(`Failed to update CSV: ${data.error}`);
        }
    })
    .catch((error) => {
        displayDebugInfo(`Error updating CSV: ${error.message}`);
    });
}

function applyFilters() {
const filterZone = document.getElementById('filterZone').value;
const filterDH = document.getElementById('filterDH').value;
const filterDepth = document.getElementById('filterDepth').value;
const filterJarBag = document.getElementById('filterJarBag').value;
const filterShelf = document.getElementById('filterShelf').value;

appliedFilters = {
'Zone': filterZone,
'DH': filterDH,
'Depth': filterDepth,
'Jar/Bag': filterJarBag,
'Shelf': filterShelf
};

// Update zone buttons to reflect the selected zone
if (zoneButtons) {
zoneButtons.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.zone === filterZone);
});
}

displayAppliedFilters();
searchSample();
}

// Update the displayAppliedFilters function
function displayAppliedFilters() {
const appliedFiltersDiv = document.getElementById('appliedFilters');
appliedFiltersDiv.innerHTML = '';

Object.keys(appliedFilters).forEach(key => {
if (appliedFilters[key]) {
    const badge = document.createElement('span');
    badge.className = 'filter-badge';
    badge.textContent = `${key}: ${appliedFilters[key]}`;
    badge.addEventListener('click', () => removeFilter(key));
    appliedFiltersDiv.appendChild(badge);
}
});
}

function removeFilter(key) {
appliedFilters[key] = '';
if (key === 'Zone' && zoneButtons) {
// Reset zone buttons
zoneButtons.forEach(btn => btn.classList.remove('selected'));
document.querySelector('.zone-button[data-zone=""]').classList.add('selected');
document.getElementById('filterZone').value = '';
} else if (key === 'DH') {
document.getElementById('filterDH').value = '';
} else if (key === 'Depth') {
document.getElementById('filterDepth').value = '';
} else if (key === 'Jar/Bag') {
document.getElementById('filterJarBag').value = '';
} else if (key === 'Shelf') {
document.getElementById('filterShelf').value = '';
}
displayAppliedFilters();
searchSample();
}

// Existing event listeners
document.getElementById('applyFilterButton').addEventListener('click', () => {
const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
applyFilters();
filterModal.hide();
});

function resetTableFilter() {
    if (!isIdentifyingMisplaced) {
        appliedFilters = {};
        displayAppliedFilters();
        const sortedSamples = sortSamplesByDH(sampleData);
        updateTable(sortedSamples);
        updateSampleCounter(sampleData.length);
        updateMap(sortedSamples, {}, []); // Reset the map to show all samples
    }
}


function deleteSample(stid) {
if (confirm('Are you sure you want to delete this sample?')) {
const index = sampleData.findIndex(sample => sample['Stid'] === stid);
if (index !== -1) {
    sampleData.splice(index, 1);
    updateCSV();
    searchSample(); // Refresh the table and map
    updateShelfCountDisplay(); // Add this line
}
}
}



document.addEventListener('DOMContentLoaded', function() {
    const placementGuideButtonContainer = document.getElementById('placementGuideButtonContainer');
    const registerModal = document.getElementById('registerModal');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const registerSampleButton = document.getElementById('registerSampleButton');
    const stidInput = document.getElementById('registerStid');
const step1Tab = document.getElementById('step1-tab');
const step2Tab = document.getElementById('step2-tab');
const step3Tab = document.getElementById('step3-tab');
const filterZoneInput = document.getElementById('filterZone');
const navTabs = [step1Tab, step2Tab, step3Tab];
const shelfSelect = document.getElementById('registerShelf'); 
zoneButtons = document.querySelectorAll('.zone-button');
const stidToggle = document.getElementById('stidToggle');
const dhToggle = document.getElementById('dhToggle');
const searchInput = document.getElementById('searchInput');
const style = document.createElement('style');
    style.textContent = `
        .modal.map-selection-mode {
            background: none !important;
            pointer-events: none;
        }
        .modal-dialog.map-selection-dialog {
            pointer-events: none;
        }
        .modal-content.map-selection-content {
            pointer-events: none;
            opacity: 0;
        }
        .map-selection-mode .modal-backdrop {
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

function updateToggleState(isStid) {
stidToggle.classList.toggle('active', isStid);
dhToggle.classList.toggle('active', !isStid);
searchInput.placeholder = isStid ? 'Search with STID' : 'Search with DH';
}

registerModal.addEventListener('show.bs.modal', () => {
    if (isSelectingPointOnMap) {
        restoreFormState();
    }
});

stidToggle.addEventListener('click', function() {
updateToggleState(true);
searchSample();
});

dhToggle.addEventListener('click', function() {
updateToggleState(false);
searchSample();
});

function checkStidAndUpdateNavLinks() {
    const isStidEntered = stidInput.value.trim() !== '';
    document.getElementById('step2-tab').classList.toggle('disabled', !isStidEntered);
    document.getElementById('step3-tab').classList.toggle('disabled', !isStidEntered);
    nextStepBtn.disabled = !isStidEntered;
}

stidInput.addEventListener('input', checkStidAndUpdateNavLinks);

nextStepBtn.addEventListener('click', () => {
    if (currentStep === 1 && !stidInput.value.trim()) {
        alert('STID is required to proceed.');
        return;
    }
    if (currentStep < 3) {
        updateNavigation(currentStep + 1);
    }
});

prevStepBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        updateNavigation(currentStep - 1);
    }
});

registerSampleButton.addEventListener('click', registerSample);

registerModal.addEventListener('hidden.bs.modal', () => {
    // Do not reset the form or navigation here
});

// Replace the existing searchSample function with this updated version
window.searchSample = searchSample;

// Update the event listener for the search input
searchInput.addEventListener('input', searchSample);


// Disable step 2 and 3 nav-links initially
step2Tab.classList.add('disabled');
step3Tab.classList.add('disabled');

// Populate shelf options
shelfSelect.innerHTML = '<option value="">Select Shelf</option>';
for (let i = 'A'.charCodeAt(0); i <= 'L'.charCodeAt(0); i++) {
for (let j = 1; j <= 4; j++) {
    const option = document.createElement('option');
    option.value = String.fromCharCode(i) + j;
    option.textContent = String.fromCharCode(i) + j;
    shelfSelect.appendChild(option);
}
}






navTabs.forEach((tab, index) => {
tab.addEventListener('click', function(e) {
    if (this.classList.contains('disabled')) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        updateNavigation(index + 1);
    }
});
});

zoneButtons.forEach(button => {
button.addEventListener('click', function() {
    zoneButtons.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    document.getElementById('filterZone').value = this.dataset.zone;
});
});

registerSampleButton.addEventListener('click', registerSample);

registerModal.addEventListener('hidden.bs.modal', () => {
updateNavigation(1);
document.getElementById('registerForm').reset();
checkStidAndUpdateNavLinks();
});

function registerSample() {
const newStid = stidInput.value.trim();

// Check if the STID already exists
const existingSample = sampleData.find(sample => sample['Stid'] === newStid);

if (existingSample) {
    // Display an error message
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            STID "${newStid}" is already in use. Please use a different STID.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.getElementById('registerModal').querySelector('.modal-body').prepend(alertContainer);
    return; // Exit the function without registering the sample
}

const newSample = {
    'Description': document.getElementById('registerDescription').value,
    'Stid': newStid,
    'Zone': document.getElementById('registerZone').value,
    'Northing': document.getElementById('registerNorthing').value,
    'Easting': document.getElementById('registerEasting').value,
    'DH': document.getElementById('registerDH').value,
    'Depth': document.getElementById('registerDepth').value,
    'Jar/Bag': document.querySelector('input[name="registerJarBag"]:checked').value,
    'Shelf': document.getElementById('registerShelf').value,
    'Weight': document.getElementById('registerWeight').value
};

sampleData.push(newSample);
updateCSV();
searchSample();
updateShelfCountDisplay();

// Remove the temporary marker if it exists
if (tempMarker) {
    map.removeLayer(tempMarker);
    tempMarker = null;
}

const registerModal = document.getElementById('registerModal');
registerModal.classList.remove('modal-selecting-point');
bootstrap.Modal.getInstance(registerModal).hide();

// Reset the form after successful registration
document.getElementById('registerForm').reset();
currentStep = 1;
updateNavigation(1);
}

// Initial check for STID and navigation setup
checkStidAndUpdateNavLinks();
updateNavigation(1);
});


function resetIdentifyMode() {
isIdentifyingMisplaced = false;
document.getElementById('sampleCounter').textContent = `Samples available: ${sampleData.length}`;
}

const searchInput = document.getElementById('searchInput');
const registerButton = document.getElementById('registerButton');
const identifyMisplacedButton = document.getElementById('identifyMisplacedButton');
const resetButton = document.getElementById('resetButton');
const filterButton = document.getElementById('filterButton');
const applyFilterButton = document.getElementById('applyFilterButton');

searchInput.addEventListener('input', () => {
if (!isIdentifyingMisplaced) {
    searchSample();
}
});

registerButton.addEventListener('click', () => {
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
registerModal.show();
});

identifyMisplacedButton.addEventListener('click', () => {
    isIdentifyingMisplaced = true;
    identifyMisplacedSamples();
});

resetButton.addEventListener('click', () => {
    isIdentifyingMisplaced = false;
    misplacedSamplesData = [];
    resetMap();
    searchSample();
    hidePlacementGuideButton();
    updateMap(sampleData, {}, []); // Refresh the map to re-enable DH clicking
});

filterButton.addEventListener('click', () => {
const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
filterModal.show();
});

applyFilterButton.addEventListener('click', () => {
const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
applyFilters();
filterModal.hide();
});


document.getElementById('placementGuideButton').addEventListener('click', showPlacementGuide);

document.addEventListener('DOMContentLoaded', () => {


const checkShelfInventoryButton = document.getElementById('checkShelfInventoryButton');
checkShelfInventoryButton.addEventListener('click', openShelfInventoryModal);



    updateNavigation(currentStep);

    initMapPointSelection();
    initMap();
    loadData();
});

