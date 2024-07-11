const coaFiles = {
    "Nexus_COA_Set_2.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_2.xlsx",
    "Nexus_COA_Set_NA.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_NA.xlsx",
    "Nexus_COA_SD.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_SD.xlsx",
    "Nexus_COA_Set_1.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_1.xlsx",
    "Nexus_COA_Set_0.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_0.xlsx",
    "Nexus_COA_Set_3.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_3.xlsx",
    "Nexus_COA_Set_4.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_4.xlsx",
    "Nexus_COA_Set_5.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_5.xlsx",
    "Nexus_COA_Set_6.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_6.xlsx",
    "Nexus_COA_Set_9.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_9.xlsx",
    "Nexus_COA_Set_20.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_20.xlsx",
    "Nexus_COA_Set_10.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/Nexus_COA_Set_10.xlsx",
    "blank": "",
    "COA_RE20211599.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20211599.pdf",
    "COA_RE20206582.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20206582.pdf",
    "COA_RE20199978.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20199978.pdf",
    "COA_RE20185806.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20185806.pdf",
    "COA_RE20213510.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20213510.pdf",
    "COA_RE20162154.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20162154.pdf",
    "COA_RE20259732.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20259732.pdf",
    "COA_RE19312060.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE19312060.pdf",
    "COA_RE19316786.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE19316786.pdf",
    "COA_RE20066840.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20066840.pdf",
    "COA_RE20034549.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20034549.pdf",
    "COA_RE20066842.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20066842.pdf",
    "COA_RE20065194.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20065194.pdf",
    "COA_RE20124950.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20124950.pdf",
    "COA_RE20131728.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE20131728.pdf",
    "COA_RE21096417.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE21096417.pdf",
    "COA_RE21095480.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE21095480.pdf",
    "COA_RE21096266.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE21096266.pdf",
    "COA_RE21096307.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/COA_RE21096307.pdf"
};

    let sampleData = [];
    let elementData = {};
    const elementPricesData = [
    { symbol: "Au", name: "Gold", price: 78000 },
    { symbol: "Pt", name: "Platinum", price: 32000 },
    { symbol: "Pd", name: "Palladium", price: 32000 },
    { symbol: "Rh", name: "Rhodium", price: 140000 },
    { symbol: "Ir", name: "Iridium", price: 151000 },
    { symbol: "Os", name: "Osmium", price: 400000 },
    { symbol: "Ru", name: "Ruthenium", price: 13000 },
    { symbol: "Ag", name: "Silver", price: 1000 },
    { symbol: "Al", name: "Aluminum", price: 2.4 },
    { symbol: "As", name: "Arsenic", price: 1.51 },
    { symbol: "B", name: "Boron", price: 2.03 },
    { symbol: "Ba", name: "Barium", price: 0.22 },
    { symbol: "Be", name: "Beryllium", price: 8240 },
    { symbol: "Bi", name: "Bismuth", price: 11.9 },
    { symbol: "Ca", name: "Calcium", price: 1.19 },
    { symbol: "Cd", name: "Cadmium", price: 4.08 },
    { symbol: "Ce", name: "Cerium", price: 1.19 },
    { symbol: "Co", name: "Cobalt", price: 68.2 },
    { symbol: "Cr", name: "Chromium", price: 10.1 },
    { symbol: "Cs", name: "Cesium", price: 125000 }, 
    { symbol: "Cu", name: "Copper", price: 8.3 },
    { symbol: "Cl", name: "Chlorine", price: 0.21 },
    { symbol: "Fe", name: "Iron", price: 0.12 },
    { symbol: "Ga", name: "Gallium", price: 409 },
    { symbol: "Ge", name: "Germanium", price: 3650 },
    { symbol: "Hf", name: "Hafnium", price: 4000 },
    { symbol: "Hg", name: "Mercury", price: 38 }, // Estimated price, not in original data
    { symbol: "In", name: "Indium", price: 381 },
    { symbol: "K", name: "Potassium", price: 16.8 },
    { symbol: "La", name: "Lanthanum", price: 1.97 },
    { symbol: "Li", name: "Lithium", price: 71.3 },
    { symbol: "Mg", name: "Magnesium", price: 2.32 },
    { symbol: "Mn", name: "Manganese", price: 2.06 },
    { symbol: "Mo", name: "Molybdenum", price: 29.4 },
    { symbol: "Na", name: "Sodium", price: 3.24 },
    { symbol: "Nb", name: "Niobium", price: 40.7 },
    { symbol: "Ni", name: "Nickel", price: 18.3 },
    { symbol: "P", name: "Phosphorus", price: 1.15 },
    { symbol: "Pb", name: "Lead", price: 2.01 },
    { symbol: "Rb", name: "Rubidium", price: 36000 }, 
    { symbol: "Re", name: "Rhenium", price: 4670 },
    { symbol: "S", name: "Sulfur", price: 0.6 },
    { symbol: "Sb", name: "Antimony", price: 11.7 },
    { symbol: "Sc", name: "Scandium", price: 270000 },
    { symbol: "Se", name: "Selenium", price: 33.4 },
    { symbol: "Sn", name: "Tin", price: 23.6 },
    { symbol: "Sr", name: "Strontium", price: 6.08 },
    { symbol: "Ta", name: "Tantalum", price: 264 },
    { symbol: "Te", name: "Tellurium", price: 62.9 },
    { symbol: "Th", name: "Thorium", price: 300 }, // Estimated price, not in original data
    { symbol: "Ti", name: "Titanium", price: 9.58 },
    { symbol: "Tl", name: "Thallium", price: 6080 },
    { symbol: "U", name: "Uranium", price: 124 }, // Estimated price, not in original data
    { symbol: "V", name: "Vanadium", price: 22.9 },
    { symbol: "W", name: "Tungsten", price: 37.8 },
    { symbol: "Y", name: "Yttrium", price: 45 },
    { symbol: "Zn", name: "Zinc", price: 2.78 },
    { symbol: "Zr", name: "Zirconium", price: 37.4 },
    { symbol: "Dy", name: "Dysprosium", price: 460 },
    { symbol: "Er", name: "Erbium", price: 43.9 },
    { symbol: "Eu", name: "Europium", price: 263 },
    { symbol: "Gd", name: "Gadolinium", price: 20.7 },
    { symbol: "Ho", name: "Holmium", price: 60.3 },
    { symbol: "Lu", name: "Lutetium", price: 6900 },
    { symbol: "Nd", name: "Neodymium", price: 116 },
    { symbol: "Pr", name: "Praseodymium", price: 114 },
    { symbol: "Sm", name: "Samarium", price: 1.97 },
    { symbol: "Tb", name: "Terbium", price: 1260 },
    { symbol: "Tm", name: "Thulium", price: 12800 },
    { symbol: "Yb", name: "Ytterbium", price: 14.3 }
];
    let appliedFilters = {}; 
    let map;
    let markers = [];
    let activeCOAs = new Set();
    let heatLayer;
    let heatmapEnabled = false;
    let heatmapMode = 'average'; // default mode
    let barChart = null;
    let pieChart = null;
    const metallurgicalTypes = ['LMB+ (Mtlg-AqRg-SMB)', 'LMB+ (Mtlg-AqRg-AC)', 'LMB+ (Mtlg-AqRg)'];
    const metallurgicalCheckboxes = document.querySelectorAll('input[value="LMB+ (Metallurgical)"]');
    let selectedIndices = [];
    let currentSortColumn = 'Element (PPM)';
    let currentSortDirection = 'desc';
    let activeZones = new Set(['1', '2', '3', '4', '5', '6']);
    let activeAssayTypes = new Set([
    'LMB Flux', 'LMB+']);
    let activeIncursionTypes = new Set(['HY20']);
    let overlayImages = {
        "Zone": {
            url: '/overlays/zone.png', 
            bounds: [
                convertUTMToLatLng(3913300, 443088),
                convertUTMToLatLng(3893000, 463668)
            ],
            layer: null
        },
        "Claims": {
            url: '/overlays/claims.png',
            bounds: [
                convertUTMToLatLng(3913300, 443088),
                convertUTMToLatLng(3893000, 463668)
            ],
            layer: null
        },
        "Sections": {
            url: '/overlays/sections.png',
            bounds: [
                convertUTMToLatLng(3913300, 443088),
                convertUTMToLatLng(3893000, 463668)
            ],
            layer: null
        }
    };

    const headers = ['Description', 'Incursion Type', 'Lab', 'Stid', 'Zone', 'Northing', 'Easting', 'DH', 'Depth', 'Assay Type', 'COA', 'Weight'];
    const elements = ['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag', 'Al', 'As', 'B', 'Ba', 'Be', 'Bi', 'Ca', 'Cd', 'Ce', 'Co', 'Cr', 'Cs', 'Cu', 'Cl', 'Fe', 'Ga', 'Ge', 'Hf', 'Hg', 'In', 'K', 'La', 'Li', 'Mg', 'Mn', 'Mo', 'Na', 'Nb', 'Ni', 'P', 'Pb', 'Rb', 'Re', 'S', 'Sb', 'Sc', 'Se', 'Sn', 'Sr', 'Ta', 'Te', 'Th', 'Ti', 'Tl', 'U', 'V', 'W', 'Y', 'Zn', 'Zr', 'Dy', 'Er', 'Eu', 'Gd', 'Ho', 'Lu', 'Nd', 'Pr', 'Sm', 'Tb', 'Tm', 'Yb'];

    function parseCSV(text) {
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return headers.reduce((object, header, index) => {
                let value = values[index] ? values[index].trim() : '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                object[header.trim()] = value;
                return object;
            }, {});
        });

        const uniqueCOAs = new Set();
        lines.slice(1).forEach((line, rowIndex) => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            elements.forEach((element, elementIndex) => {
                const elementColumnIndex = headers.length + elementIndex;
                let value = values[elementColumnIndex] ? values[elementColumnIndex].trim() : '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                value = value.replace(/,/g, ''); 
                elementData[rowIndex] = elementData[rowIndex] || {};
                elementData[rowIndex][element] = value;
            });

            const coaValue = values[headers.indexOf('COA')].trim();
            if (coaValue) {
                uniqueCOAs.add(coaValue);
            }
        });

        createCOACheckboxes(uniqueCOAs);

        return data;
    }



    function createCOACheckboxes(coaValues) {
        const sidebarContainer = document.querySelector('#sidebarCOACheckboxContainer');
        
        sidebarContainer.innerHTML = '';
    
        coaValues.forEach(coa => {
            const label = document.createElement('label');
            
            label.innerHTML = `<input type="checkbox" value="${coa}" checked> ${coa}`;
            
            sidebarContainer.appendChild(label);
            
            activeCOAs.add(coa);
        });
    
        document.querySelectorAll('#sidebarCOACheckboxContainer input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    activeCOAs.add(this.value);
                } else {
                    activeCOAs.delete(this.value);
                }
                updateMap();
                updateElementTable();
            });
        });
    }



// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

// Function to show tooltip
function showTooltip(event) {
    const target = event.currentTarget;
    const tooltipText = target.getAttribute('data-tooltip');
    tooltip.textContent = tooltipText;
    tooltip.style.display = 'block';

    // Position the tooltip
    const rect = target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

    // Animate the tooltip
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
}

// Function to hide tooltip
function hideTooltip() {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 300);
}

// Add event listeners to elements with data-tooltip attribute
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
});




    $(document).ready(function() {
    $('#periodicModal').on('shown.bs.modal', function () {
        $(this).find('.modal-body').load('/periodic.html', function() {
            $('.chip').click(function() {
                var elementName = $(this).find('.face.front strong').text();
                var $dropdown = $('#elementSelect');
                
                $dropdown.val(elementName);
                
                setTimeout(function() {
                    $dropdown.trigger('change');
                    
                    var event = new Event('change', { bubbles: true });
                    $dropdown[0].dispatchEvent(event);
                }, 10); 
                
                $('#periodicModal').modal('hide');
            });
        });
    });
});

document.getElementById('removeCutoff').addEventListener('click', removeCutoff);

function removeCutoff() {
    // Array of input IDs to clear
    const inputIds = ['minCutoff', 'maxCutoff'];

    // Clear all cutoff input fields if they exist
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        } else {
            console.warn(`Input element with id '${id}' not found.`);
        }
    });

    // Delay the application of changes slightly to ensure DOM update
    setTimeout(() => {
        const applyCutoffButton = document.getElementById('applyCutoff');
        if (applyCutoffButton) {
            applyCutoffButton.click();
        }
    }, 50);
}


document.getElementById('applyCutoff').addEventListener('click', () => {
    updateMap();
    updateElementTable();
    updateElementAverages()
});

// Function to export table data to CSV
function exportTableToCSV(filename) {
    const table = document.getElementById('elementTable');
    const rows = table.querySelectorAll('tr');
    const csv = [];

    // Get headers
    const headers = [];
    const headerCells = rows[0].querySelectorAll('th');
    headerCells.forEach(cell => {
        headers.push(cell.textContent.trim());
    });
    csv.push(headers.join(','));

    // Get data rows
    for (let i = 1; i < rows.length; i++) {
        const row = [];
        const cells = rows[i].querySelectorAll('td');
        cells.forEach(cell => {
            // Escape double quotes and wrap the content in quotes
            let content = cell.textContent.trim().replace(/"/g, '""');
            row.push(`"${content}"`);
        });
        csv.push(row.join(','));
    }

    // Create CSV content
    const csvContent = csv.join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Add click event listener to the export button
document.querySelector('.table-download').addEventListener('click', function() {
    const selectedElement = document.getElementById('elementSelect').value;
    const filename = `RRCM_Table_Element_${selectedElement}_${new Date().toISOString().slice(0,10)}.csv`;
    exportTableToCSV(filename);
});



function updateElementAverages() {
    const selectedElement = document.getElementById('elementSelect').value;
    document.getElementById('selectedElement').textContent = selectedElement;

    let total = 0;
    let count = 0;
    let highest = -Infinity;
    const zoneData = {};

    // Get cut-off values
    const minCutoff = parseFloat(document.getElementById('minCutoff').value) || -Infinity;
    const maxCutoff = parseFloat(document.getElementById('maxCutoff').value) || Infinity;

    // Find the price of the selected element (price is per kg in the data)
    const elementPrice = elementPricesData.find(el => el.symbol === selectedElement)?.price || 0;

    sampleData.forEach((sample, index) => {
        if (activeIncursionTypes.has(sample['Incursion Type']) &&
            activeAssayTypes.has(sample['Assay Type']) &&
            activeZones.has(sample['Zone']) &&
            activeCOAs.has(sample['COA'])) {

            const elementValue = elementData[index] && elementData[index][selectedElement] ? 
                                 parseFloat(elementData[index][selectedElement].replace(/["',]/g, '')) : NaN;

            if (!isNaN(elementValue) && elementValue >= minCutoff && elementValue <= maxCutoff) {
                total += elementValue;
                count++;
                highest = Math.max(highest, elementValue);

                const zone = sample['Zone'];
                if (!zoneData[zone]) {
                    zoneData[zone] = { total: 0, count: 0, highest: -Infinity };
                }
                zoneData[zone].total += elementValue;
                zoneData[zone].count++;
                zoneData[zone].highest = Math.max(zoneData[zone].highest, elementValue);
            }
        }
    });

    // Update overall assay count
    document.getElementById('overallAssayCount').textContent = count;

    // Update overall averages
    if (count > 0) {
        const average = total / count;
        const pricePerTonneHighest = (highest / 1000) * elementPrice;
        const pricePerTonneAverage = (average / 1000) * elementPrice;

        document.getElementById('averageValue').textContent = `${formatNumberWithCommas(average.toFixed(2))} ppm`;
        document.getElementById('averageValuePerTonne').textContent = `$${formatNumberWithCommas(pricePerTonneAverage.toFixed(2))}`;
        document.getElementById('highestValue').textContent = `${formatNumberWithCommas(highest.toFixed(2))} ppm`;
        document.getElementById('highestValuePerTonne').textContent = `$${formatNumberWithCommas(pricePerTonneHighest.toFixed(2))}`;
    } else {
        document.getElementById('averageValue').textContent = 'N/A';
        document.getElementById('averageValuePerTonne').textContent = 'N/A';
        document.getElementById('highestValue').textContent = 'N/A';
        document.getElementById('highestValuePerTonne').textContent = 'N/A';
    }

    // Update zone averages
    const zoneAveragesList = document.getElementById('zoneAveragesList');
    zoneAveragesList.innerHTML = '';

    Object.entries(zoneData).sort((a, b) => a[0].localeCompare(b[0])).forEach(([zone, data]) => {
        const average = data.count > 0 ? data.total / data.count : 0;
        const zoneItem = document.createElement('div');
        zoneItem.className = 'zone-item';
        
        const pricePerTonneHighest = (data.highest / 1000) * elementPrice;
        const pricePerTonneAverage = (average / 1000) * elementPrice;

        zoneItem.innerHTML = `
            <div class="zone-title">Zone ${zone}</div>
            <div class="zone-stat empty-space">
                <span>Assays Done:</span>
                <span style="font-weight: bold;">${data.count}</span>
            </div>
            <div class="zone-stat">
                <span>Average:</span>
                <span class="average-value">${formatNumberWithCommas(average.toFixed(2))} ppm</span>
            </div>
            <div class="zone-stat">
                <span>Value/tonne:</span>
                <span class="price-value">$${formatNumberWithCommas(pricePerTonneAverage.toFixed(2))}</span>
            </div>
            <div class="zone-stat empty-space-top">
                <span>Highest:</span>
                <span class="highest-value">${formatNumberWithCommas(data.highest.toFixed(2))} ppm</span>
            </div>
            <div class="zone-stat">
                <span>Value/tonne:</span>
                <span class="price-value">$${formatNumberWithCommas(pricePerTonneHighest.toFixed(2))}</span>
            </div>
        `;
        zoneAveragesList.appendChild(zoneItem);
    });
}

const elementPrices = {};
let lastUpdated = null;

function fetchElementPrices() {
    elementPricesData.forEach(element => {
        elementPrices[element.symbol] = { 
            name: element.name, 
            price: element.price  // Price is in $/kg
        };
    });
    lastUpdated = new Date();
    localStorage.setItem('elementPrices', JSON.stringify(elementPrices));
    localStorage.setItem('lastUpdated', lastUpdated.toISOString());
}

function updateElementPricesModal() {
    const container = document.getElementById('elementPricesContainer');
    container.innerHTML = '';

    const categories = [
        {
            name: "Primary (PGM's + Others)",
            elements: ['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag']
        },
        {
            name: "Secondary (Targeted Elements)",
            elements: ['Rb', 'Cs', 'Sc']
        },
        {
            name: "Tertiary (Other Targeted Elements)",
            elements: elementPricesData.map(el => el.symbol).filter(symbol => 
                !['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag', 'Rb', 'Cs', 'Sc'].includes(symbol)
            )
        }
    ];

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'col-12 mb-4';
        categoryDiv.innerHTML = `<h4>${category.name}</h4>`;
        
        const row = document.createElement('div');
        row.className = 'row';

        category.elements.forEach(symbol => {
            const elementInfo = elementPricesData.find(el => el.symbol === symbol);
            if (elementInfo) {
                const pricePerGram = elementInfo.price / 1000; // Convert $/kg to $/g
                const card = document.createElement('div');
                card.className = 'col-md-4 col-sm-6 mb-3';
                card.innerHTML = `
                    <div class="element-price-card" data-element="${elementInfo.symbol}">
                        <div class="element-symbol">${elementInfo.symbol}</div>
                        <div class="element-name">${elementInfo.name}</div>
                        <div class="element-price">$${pricePerGram.toFixed(2)}/g</div>
                    </div>
                `;
                row.appendChild(card);
            }
        });

        categoryDiv.appendChild(row);
        container.appendChild(categoryDiv);
    });

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'col-12 text-center mt-3';
    timestampDiv.textContent = `Last updated: ${lastUpdated ? lastUpdated.toLocaleString() : 'Never'}`;
    container.appendChild(timestampDiv);

    // Add click event listeners to element cards
    container.querySelectorAll('.element-price-card').forEach(card => {
        card.addEventListener('click', function() {
            const selectedElement = this.dataset.element;
            const elementSelect = document.getElementById('elementSelect');
            elementSelect.value = selectedElement;
            
            // Trigger the change event
            const event = new Event('change');
            elementSelect.dispatchEvent(event);

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('elementPricesModal'));
            modal.hide();
        });
    });
}

document.getElementById('elementPricesBtn').addEventListener('click', () => {
    if (Object.keys(elementPrices).length === 0) {
        fetchElementPrices();
    }
    updateElementPricesModal();
    const modal = new bootstrap.Modal(document.getElementById('elementPricesModal'));
    modal.show();
});

function hideModalBackdrop(modalId) {
        const modal = document.getElementById(modalId);
        const modalBackdrop = document.querySelector('.modal-backdrop');

        modal.classList.remove('show');
        modal.style.display = 'none';
        
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }

        document.body.classList.remove('modal-open');
        document.body.style = '';
    }

    document.getElementById('coaModal').addEventListener('hidden.bs.modal', function () {
        hideModalBackdrop('coaModal');
    });

    document.getElementById('periodicModal').addEventListener('hidden.bs.modal', function () {
        hideModalBackdrop('periodicModal');
    });

    function initMap() {
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; RRCM &mdash; BGS'
        });

        const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; RRCM &mdash; BGS'
        });

        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; RRCM &mdash; BGS'
        });

        map = L.map('map', {
            layers: [satelliteLayer]
        }).setView([0, 0], 2);

        const baseLayers = {
            "Satellite": satelliteLayer,
            "Topographic": topoLayer,
            "Street": streetLayer,
        };

        L.control.layers(baseLayers).addTo(map);

        for (let key in overlayImages) {
            overlayImages[key].layer = L.imageOverlay(overlayImages[key].url, overlayImages[key].bounds);
            if (key === "Zone") {
                overlayImages[key].layer.addTo(map);
            }
        }
    }

    function convertUTMToLatLng(northing, easting) {
        const utm = "+proj=utm +zone=11 +datum=WGS84";
        const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
        const result = proj4(utm, wgs84, [parseFloat(easting), parseFloat(northing)]);
        return [result[1], result[0]];
    }

    function createPopupContent(indices) {
        let content = '<div class="scrollable-tooltip">';
        indices.forEach(index => {
            content += `<div id="tooltipContent-${index}">${generateTooltipTable(sampleData[index])}</div>`;
        });
        content += '</div>';
        return content;
    }


    function generateTooltipTable(sample) {
        let content = '<table class="table table-sm">';
        headers.forEach(header => {
            content += `<tr><th>${header}</th><td>${sample[header]}</td></tr>`;
        });
        content += '</table>';
        return content;
    }

        function filterTableByPoint(indices) {
            selectedIndices = indices;
            const selectedElement = document.getElementById('elementSelect').value;
            const tbody = document.querySelector('#elementTable tbody');
            tbody.innerHTML = '';

            const selectedDH = sampleData[indices[0]].DH;
            document.getElementById('selectedDH').textContent = `Selected DH: ${selectedDH}`;
            document.getElementById('selectedDH').style.display = 'inline-block';

            let totalElementPPM = 0;
            let countElementPPM = 0;
            let highestElementPPM = -Infinity;

            indices.sort((a, b) => {
                const aValue = elementData[a] ? parseFloat(elementData[a][selectedElement].replace(/,/g, '')) : NaN;
                const bValue = elementData[b] ? parseFloat(elementData[b][selectedElement].replace(/,/g, '')) : NaN;
                return bValue - aValue;
            });

            indices.forEach(index => {
                const sample = sampleData[index];
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const cell = document.createElement('td');
                    cell.textContent = sample[header] || '';
                    if (header === 'COA') {
                        cell.classList.add('editable');
                        cell.addEventListener('click', function() {
                            const cellValue = this.textContent.trim();
                            const fileExtension = cellValue.split('.').pop().toLowerCase();
                            document.getElementById('coaModalLabel').textContent = cellValue;

                            if (fileExtension === 'pdf') {
                                document.getElementById('coaIframe').src = `/coas/${cellValue}`;
                                document.getElementById('coaIframe').style.display = 'block';
                                document.getElementById('excelContainer').style.display = 'none';
                            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                                const encodedUrl = encodeURIComponent(window.location.origin + '/coas/' + cellValue);
                                document.getElementById('coaIframe').style.display = 'block';
                                document.getElementById('excelContainer').style.display = 'none';
                            } else {
                                document.getElementById('coaIframe').src = '';
                                document.getElementById('coaIframe').style.display = 'none';
                                document.getElementById('excelContainer').textContent = 'Cannot display the file. Unsupported file format.';
                                document.getElementById('excelContainer').style.display = 'block';
                            }

                            const modal = new bootstrap.Modal(document.getElementById('coaModal'));
                            modal.show();
                        });
                    }
                    row.appendChild(cell);
                });
                const elementCell = document.createElement('td');
                const elementValue = elementData[index] ? elementData[index][selectedElement] : '';
                elementCell.textContent = formatNumberWithCommas(elementValue);
                row.appendChild(elementCell);
                tbody.appendChild(row);

                if (elementValue) {
                    const value = parseFloat(elementValue.replace(/,/g, ''));
                    if (!isNaN(value)) {
                        totalElementPPM += value;
                        countElementPPM++;
                        if (value > highestElementPPM) {
                            highestElementPPM = value;
                        }
                    }
                }
            });

            const averageElementPPM = countElementPPM > 0 ? (totalElementPPM / countElementPPM).toFixed(2) : 'N/A';
            const highestElementPPMFormatted = highestElementPPM > -Infinity ? formatNumberWithCommas(highestElementPPM.toFixed(2)) : 'N/A';

            document.getElementById('selectedElementPPM').textContent = `Average Grade: ${formatNumberWithCommas(averageElementPPM)}`;
            document.getElementById('selectedElementHighestPPM').textContent = `Highest Grade: ${highestElementPPMFormatted}`;

            document.getElementById('selectedElementPPM').style.display = 'inline-block';
            document.getElementById('selectedElementHighestPPM').style.display = 'inline-block';

            document.getElementById('clearSelectionButton').style.display = 'inline-block';
        }

        function viewExcelFile(filePath) {
            fetch(filePath)
            
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer();
                })
                .then(data => {
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const excelContainer = document.getElementById('excelContainer');
                    excelContainer.innerHTML = XLSX.utils.sheet_to_html(worksheet);
                    document.getElementById('coaIframe').style.display = 'none';
                    excelContainer.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading Excel file:', error);
                });
        }



        function clearPointSelection() {
            selectedIndices = [];
            updateElementTable();
            document.getElementById('clearSelectionButton').style.display = 'none';
            document.getElementById('selectedDH').style.display = 'none';
            document.getElementById('selectedElementPPM').style.display = 'none';
            document.getElementById('selectedElementHighestPPM').style.display = 'none';
        }


function createCustomIcon(dh, incursionType) {
    if (incursionType === 'HN04') {
        return L.divIcon({
            className: 'red-dot-icon',
            iconSize: [6, 6]
        });
    } if (incursionType === 'Rock') {
        return L.divIcon({
            className: 'purple-rectangle-icon',
            iconSize: [12, 8]
        });
    } if (incursionType === 'Source Sample') {
        return L.divIcon({
            className: 'source-icon',
            iconSize: [10, 7]
        });
    } if (incursionType === 'Shaft') {
        return L.icon({
            iconUrl: 'overlays/shafticon.png', 
            iconSize: [20, 20],  
            iconAnchor: [10, 10],  
            popupAnchor: [0, -10]  
        });
    } else {
        return L.divIcon({
            className: 'custom-div-icon',
            html: dh,
            iconSize: [11, 11],
            iconAnchor: [11, 11],
            popupAnchor: [0, -11],
        });
    }
}

    document.getElementById('toggleHeatmapButton').addEventListener('click', () => {
    const selectedElement = document.getElementById('elementSelect').value;
    if (selectedElement) {
        toggleHeatmap(selectedElement);
    } else {
        alert('Please select an element first.');
    }
});

function toggleHeatmap(selectedElement) {
    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
        document.getElementById('toggleHeatmapButton').textContent = 'Show Heatmap';
        document.getElementById('heatmapLegend').style.display = 'none';
        heatmapEnabled = false;
    } else {
        const heatData = calculateHeatmapData(selectedElement, heatmapMode);
        heatLayer = L.heatLayer(heatData.data, { radius: 25, maxZoom: 12 }).addTo(map);
        document.getElementById('toggleHeatmapButton').textContent = 'Hide Heatmap';
        document.getElementById('heatmapLegend').style.display = 'block';
        updateHeatmapLegend(heatData.maxPPM);
        heatmapEnabled = true;
    }
}



document.getElementById('heatmapModeButton').addEventListener('click', () => {
    heatmapMode = heatmapMode === 'average' ? 'highest' : 'average';
    document.getElementById('heatmapModeButton').textContent = heatmapMode === 'average' ? 'Heatmap by Highest ppm' : 'Heatmap by Average ppm';

 
    const selectedElement = document.getElementById('elementSelect').value;
    if (heatmapEnabled && selectedElement) {
        toggleHeatmap(selectedElement); 
        toggleHeatmap(selectedElement);
    }
});




function calculateHeatmapData(selectedElement, mode) {
    const minCutoff = parseFloat(document.getElementById('minCutoff').value) || -Infinity;
    const maxCutoff = parseFloat(document.getElementById('maxCutoff').value) || Infinity;
    const dhMap = new Map();
    let maxPPM = 0;

    sampleData.forEach((sample, index) => {
        if (sample.Northing && sample.Easting &&
            activeIncursionTypes.has(sample['Incursion Type']) &&
            activeAssayTypes.has(sample['Assay Type']) &&
            activeZones.has(sample['Zone']) &&
            activeCOAs.has(sample['COA'])) {

            const latLng = convertUTMToLatLng(sample.Northing, sample.Easting);
            const dh = sample.DH;

            const elementValue = elementData[index] ? parseFloat(elementData[index][selectedElement].replace(/,/g, '')) : NaN;

            if (!isNaN(elementValue) && elementValue >= minCutoff && elementValue <= maxCutoff) {
                if (!dhMap.has(dh)) {
                    dhMap.set(dh, { latLng, totalPPM: 0, count: 0, highestPPM: -Infinity });
                }

                const dhData = dhMap.get(dh);
                dhData.totalPPM += elementValue;
                dhData.count++;
                if (elementValue > dhData.highestPPM) {
                    dhData.highestPPM = elementValue;
                }
            }
        }
    });

    const heatData = [];
    dhMap.forEach((value, dh) => {
        let heatmapValue;
        if (mode === 'highest') {
            heatmapValue = value.highestPPM;
        } else {
            heatmapValue = value.totalPPM / value.count;
        }
        if (heatmapValue > maxPPM) {
            maxPPM = heatmapValue;
        }
        heatData.push([value.latLng[0], value.latLng[1], heatmapValue]);
    });

    return { data: heatData.map(([lat, lng, ppm]) => [lat, lng, ppm / maxPPM]), maxPPM };
}


function updateHeatmapLegend(maxPPM) {
    const legendColors = [
        { color: '#00f', value: (maxPPM * 0.2).toFixed(2) },
        { color: '#0ff', value: (maxPPM * 0.4).toFixed(2) },
        { color: '#0f0', value: (maxPPM * 0.6).toFixed(2) },
        { color: '#ff0', value: (maxPPM * 0.8).toFixed(2) },
        { color: '#f00', value: maxPPM.toFixed(2) }
    ];

    const legendContainer = document.getElementById('legendColors');
    legendContainer.innerHTML = '';

    legendColors.forEach(({ color, value }) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'heatmap-legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'heatmap-legend-color';
        colorBox.style.backgroundColor = color;

        const legendText = document.createElement('div');
        legendText.className = 'heatmap-legend-text';
        legendText.textContent = `${formatNumberWithCommas(value)} ppm`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(legendText);
        legendContainer.appendChild(legendItem);
    });
}


function updateMap() {
    const minCutoff = parseFloat(document.getElementById('minCutoff').value) || -Infinity;
    const maxCutoff = parseFloat(document.getElementById('maxCutoff').value) || Infinity;
    const selectedElement = document.getElementById('elementSelect').value;

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
    }

    const uniquePoints = new Map();

    sampleData.forEach((sample, index) => {
        if (sample.Northing && sample.Easting &&
            activeIncursionTypes.has(sample['Incursion Type']) &&
            activeAssayTypes.has(sample['Assay Type']) &&
            activeZones.has(sample['Zone']) &&
            activeCOAs.has(sample['COA'])) {

            const elementValue = elementData[index] && elementData[index][selectedElement] ? 
                                 parseFloat(elementData[index][selectedElement].replace(/["',]/g, '')) : NaN;

            if (!isNaN(elementValue) && elementValue >= minCutoff && elementValue <= maxCutoff) {
                const latLng = convertUTMToLatLng(sample.Northing, sample.Easting);
                const key = `${latLng[0]},${latLng[1]},${sample.DH}`;

                if (!uniquePoints.has(key)) {
                    uniquePoints.set(key, []);
                }
                uniquePoints.get(key).push(index);
            }
        }
    });

    uniquePoints.forEach((indices, key) => {
        const [lat, lng] = key.split(',').map(Number);
        const marker = L.marker([lat, lng], { icon: createCustomIcon(sampleData[indices[0]].DH, sampleData[indices[0]]['Incursion Type']) }).addTo(map);
        
        const tooltipContent = generateTooltipContent(indices);
        marker.bindTooltip(tooltipContent, { className: 'custom-tooltip' });
        marker.bindPopup(() => createPopupContent(indices));
        marker.on('click', () => filterTableByPoint(indices));
        marker.on('popupclose', () => clearPointSelection());
        markers.push(marker);
    });

    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }

    if (heatmapEnabled) {
        const heatData = calculateHeatmapData(selectedElement);
        heatLayer = L.heatLayer(heatData.data, { radius: 25, maxZoom: 12 }).addTo(map);
        document.getElementById('toggleHeatmapButton').textContent = 'Hide Heatmap';
        updateHeatmapLegend(heatData.maxPPM); 
    } else {
        document.getElementById('toggleHeatmapButton').textContent = 'Show Heatmap';
    }

    updateElementTable();
}


function generateTooltipContent(indices) {
    const selectedElement = document.getElementById('elementSelect').value;
    let totalPPM = 0;
    let highestPPM = -Infinity;
    let count = 0;
    const stids = new Set();

    // Find the price of the selected element (price is per kg in the data)
    const elementPrice = elementPricesData.find(el => el.symbol === selectedElement)?.price || 0;

    indices.forEach(index => {
        const elementValue = elementData[index] ? parseFloat(elementData[index][selectedElement].replace(/,/g, '')) : NaN;
        if (!isNaN(elementValue)) {
            totalPPM += elementValue;
            if (elementValue > highestPPM) {
                highestPPM = elementValue;
            }
            count++;
        }
        stids.add(sampleData[index].Stid);
    });

    const averagePPM = count > 0 ? (totalPPM / count) : NaN;
    const stidList = Array.from(stids).join(', ');

    // Calculate value/tonne for average and highest
    const valuePerTonneAvg = (averagePPM / 1000) * elementPrice;
    const valuePerTonneHighest = (highestPPM / 1000) * elementPrice;

    return `
        <div class="tooltip-content">
            <div>DH: <b>${sampleData[indices[0]].DH}</b></div>
            
            <div>Assays Done: <strong>${count}</strong></div>
            <div>
                Average Grade: <span style="color: red; font-weight: bold;">${formatNumberWithCommas(averagePPM.toFixed(2))} ppm</span><br>
                Value/tonne: <span style="color: green; font-weight: bold;">$${formatNumberWithCommas(valuePerTonneAvg.toFixed(2))}</span>
            </div>
            <div>
                Highest Grade: <span style="color: #34b2ef; font-weight: bold;">${formatNumberWithCommas(highestPPM.toFixed(2))} ppm</span><br>
                Value/tonne: <span style="color: green; font-weight: bold;">$${formatNumberWithCommas(valuePerTonneHighest.toFixed(2))}</span>
            </div>
        </div>
    `;
}


const style = document.createElement('style');
style.innerHTML = `
.custom-tooltip {
    max-width: 300px !important;
    word-wrap: break-word !important;
}

.tooltip-content {
    overflow: auto;
}

.tooltip-content .stid-list {
    white-space: pre-wrap; 
    word-break: break-word; 
}
`;
document.head.appendChild(style);



function loadData() {
    const csvFileUrl = 'https://main--stellular-khapse-e51f2d.netlify.app/mapdata.csv'; // 
    const timestamp = new Date().getTime();
    fetch(`${csvFileUrl}?t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            sampleData = parseCSV(text);
            updateMap();
            updateElementTable();
        })
        .catch(error => {
            console.error('Error loading the CSV file:', error);
        });
}


  

  function updateElementTable() {
    const selectedElement = document.getElementById('elementSelect').value;
    const tbody = document.querySelector('#elementTable tbody');
    const minCutoff = parseFloat(document.getElementById('minCutoff').value) || -Infinity;
    const maxCutoff = parseFloat(document.getElementById('maxCutoff').value) || Infinity;
    tbody.innerHTML = '';

    let sortedData = [...sampleData];
    let total = 0;
    let count = 0;

    if (selectedIndices.length > 0) {
        sortedData = selectedIndices.map(index => sampleData[index]);
    }

    sortedData = sortedData.filter(sample =>
        activeIncursionTypes.has(sample['Incursion Type']) &&
        activeAssayTypes.has(sample['Assay Type']) &&
        activeZones.has(sample['Zone']) &&
        activeCOAs.has(sample['COA'])
    );

    sortedData.sort((a, b) => {
        let aValue = a[currentSortColumn];
        let bValue = b[currentSortColumn];

        if (currentSortColumn === 'Element (PPM)') {
            aValue = elementData[sampleData.indexOf(a)] && elementData[sampleData.indexOf(a)][selectedElement] ?
                parseFloat(elementData[sampleData.indexOf(a)][selectedElement].replace(/["',]/g, '')) || 0 : 0;
            bValue = elementData[sampleData.indexOf(b)] && elementData[sampleData.indexOf(b)][selectedElement] ?
                parseFloat(elementData[sampleData.indexOf(b)][selectedElement].replace(/["',]/g, '')) || 0 : 0;
        }

        if (aValue < bValue) {
            return currentSortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return currentSortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    sortedData.forEach((sample, index) => {
        if (selectedIndices.length === 0 || selectedIndices.includes(sampleData.indexOf(sample))) {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = sample[header] || '';
                if (header === 'COA') {
                    cell.classList.add('editable');
                    cell.addEventListener('click', function() {
                        const cellValue = this.textContent.trim();
                        const fileExtension = cellValue.split('.').pop().toLowerCase();
                        document.getElementById('coaModalLabel').textContent = cellValue;

                        if (fileExtension === 'pdf') {
                            document.getElementById('coaIframe').src = `/coas/${cellValue}`;
                            document.getElementById('coaIframe').style.display = 'block';
                            document.getElementById('excelContainer').style.display = 'none';
                        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                            const encodedUrl = encodeURIComponent(window.location.origin + '/coas/' + cellValue);
                            document.getElementById('coaIframe').style.display = 'block';
                            document.getElementById('excelContainer').style.display = 'none';
                        } else {
                            document.getElementById('coaIframe').src = '';
                            document.getElementById('coaIframe').style.display = 'none';
                            document.getElementById('excelContainer').textContent = 'Cannot display the file. Unsupported file format.';
                            document.getElementById('excelContainer').style.display = 'block';
                        }

                        const modal = new bootstrap.Modal(document.getElementById('coaModal'));
                        modal.show();
                    });
                } else if (header === 'DH') {
                    cell.classList.add('editable-dh');
                    cell.addEventListener('click', function() {
                        const dh = this.textContent.trim();
                        const indices = sampleData.reduce((acc, sample, idx) => {
                            if (sample.DH === dh) {
                                acc.push(idx);
                            }
                            return acc;
                        }, []);
                        if (indices.length > 0) {
                            filterTableByPoint(indices);
                            const marker = markers.find(m => m.getPopup().getContent().includes(`DH: ${dh}`));
                            if (marker) {
                                marker.openPopup();
                            }
                        }
                    });
                }
                row.appendChild(cell);
            });
            const elementCell = document.createElement('td');
            let elementValue = elementData[sampleData.indexOf(sample)] && elementData[sampleData.indexOf(sample)][selectedElement] ?
                elementData[sampleData.indexOf(sample)][selectedElement] : '';
            elementValue = elementValue.replace(/["']/g, ''); // Remove double quotes

            const numericValue = parseFloat(elementValue.replace(/,/g, ''));
            if (!isNaN(numericValue) && numericValue >= minCutoff && numericValue <= maxCutoff) {
                elementCell.textContent = formatNumberWithCommas(elementValue);
                row.appendChild(elementCell);
                tbody.appendChild(row);

                if (selectedElement) {
                    if (!isNaN(numericValue)) {
                        total += numericValue;
                        count++;
                    }
                }
            }
        }
    });

    updateAverageValue(total, count);
    updateZoneAverages();
    updateElementAverages();
    updateSelectedDHAverage(); 
}



function updateSelectedDHAverage() {
    if (selectedIndices.length > 0) {
        let totalElementPPM = 0;
        let countElementPPM = 0;
        let highestElementPPM = -Infinity;
        const selectedElement = document.getElementById('elementSelect').value;

        selectedIndices.forEach(index => {
            const elementValue = elementData[index] ? elementData[index][selectedElement] : '';
            if (elementValue) {
                const value = parseFloat(elementValue.replace(/,/g, ''));
                if (!isNaN(value)) {
                    totalElementPPM += value;
                    countElementPPM++;
                    if (value > highestElementPPM) {
                        highestElementPPM = value;
                    }
                }
            }
        });

        const averageElementPPM = countElementPPM > 0 ? (totalElementPPM / countElementPPM).toFixed(2) : 'N/A';
        const highestElementPPMFormatted = highestElementPPM > -Infinity ? formatNumberWithCommas(highestElementPPM.toFixed(2)) : 'N/A';

        document.getElementById('selectedElementPPM').textContent = `Average Grade: ${formatNumberWithCommas(averageElementPPM)}`;
        document.getElementById('selectedElementPPM').style.display = 'inline-block';

        document.getElementById('selectedElementHighestPPM').textContent = `Highest Grade: ${highestElementPPMFormatted}`;
        document.getElementById('selectedElementHighestPPM').style.display = 'inline-block';
    } else {
        document.getElementById('selectedElementPPM').style.display = 'none';
        document.getElementById('selectedElementHighestPPM').style.display = 'none';
    }
}

function updateAverageValue(total, count) {
    const averageValueElement = document.getElementById('averageValue');
    if (count > 0) {
        const average = total / count;
        averageValueElement.textContent = formatNumberWithCommas(average.toFixed(2));
    } else {
        averageValueElement.textContent = 'N/A';
    }
}

function formatNumberWithCommas(value) {
    if (!value) return value;
    const parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}


document.getElementById('elementSelect').addEventListener('change', () => {
    const selectedElement = document.getElementById('elementSelect').value;
    const elementInfo = elementPricesData.find(el => el.symbol === selectedElement);
    
    if (elementInfo) {
        document.getElementById('selectedElementName').textContent = elementInfo.name;
        document.getElementById('selectedElement').textContent = elementInfo.symbol;
    } else {
        document.getElementById('selectedElementName').textContent = '';
        document.getElementById('selectedElement').textContent = selectedElement;
    }

    updateElementTable();
    updateMap();
    updateSelectedDHAverage();
    updateElementAverages();
    updateZoneAverages();
});


function openVisualizationModal() {
    const modal = new bootstrap.Modal(document.getElementById('visualizationModal'));
    modal.show();
    
    // Wait for the modal to be fully visible before rendering charts
    document.getElementById('visualizationModal').addEventListener('shown.bs.modal', function () {
        renderCharts();
    }, { once: true }); // Use { once: true } to ensure the listener is removed after it's called
}

function renderCharts() {
    renderBarChart();
    renderPieChart();
}

function renderBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: visualizationData.map(d => d.name),
            datasets: [
                {
                    label: 'Average (ppm)',
                    data: visualizationData.map(d => d.average),
                    backgroundColor: '#ff0000'
                },
                {
                    label: 'Highest (ppm)',
                    data: visualizationData.map(d => d.highest),
                    backgroundColor: '#34b2ef'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'PPM'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatNumberWithCommas(context.parsed.y.toFixed(2)) + ' ppm';
                            }
                            const data = visualizationData[context.dataIndex];
                            if (context.datasetIndex === 0) {
                                label += ` ($${formatNumberWithCommas(data.averagePrice.toFixed(2))}/tonne)`;
                            } else {
                                label += ` ($${formatNumberWithCommas(data.highestPrice.toFixed(2))}/tonne)`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function renderPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (pieChart) {
        pieChart.destroy();
    }

    // Define color mapping for zones
    const zoneColors = {
        'Zone 1': '#e02a2c',
        'Zone 2': '#44a0ff',
        'Zone 3': '#5035d8',
        'Zone 4': '#3cdf19',
        'Zone 5': '#ffcd57',
        'Zone 6': '#c61dde'
    };

    // Sort visualizationData to ensure consistent order
    const sortedData = visualizationData.sort((a, b) => {
        return parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]);
    });

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: sortedData.map(d => d.name),
            datasets: [{
                data: sortedData.map(d => d.count),
                backgroundColor: sortedData.map(d => zoneColors[d.name]),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Assay Count Distribution'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + ' assays';
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

document.getElementById('visualizeButton').addEventListener('click', () => {
    openVisualizationModal();
});

function updateZoneAverages() {
    const selectedElement = document.getElementById('elementSelect').value;
    const elementPrice = elementPricesData.find(el => el.symbol === selectedElement)?.price || 0;
    const zoneData = {};

    sampleData.forEach((sample, index) => {
        if (activeIncursionTypes.has(sample['Incursion Type']) &&
            activeAssayTypes.has(sample['Assay Type']) &&
            activeZones.has(sample['Zone']) &&
            activeCOAs.has(sample['COA'])) {

            const zone = sample['Zone'];
            const elementValue = elementData[index] && elementData[index][selectedElement] ? 
                                 parseFloat(elementData[index][selectedElement].replace(/["',]/g, '')) : NaN;

            if (!isNaN(elementValue)) {
                if (!zoneData[zone]) {
                    zoneData[zone] = { total: 0, count: 0, highest: -Infinity };
                }
                zoneData[zone].total += elementValue;
                zoneData[zone].count++;
                zoneData[zone].highest = Math.max(zoneData[zone].highest, elementValue);
            } if (document.getElementById('visualizationModal').classList.contains('show')) {
                renderCharts();
            }
        }
    });

    visualizationData = Object.entries(zoneData).map(([zone, data]) => {
        const average = data.count > 0 ? data.total / data.count : 0;
        return {
            name: `Zone ${zone}`,
            average: average,
            highest: data.highest,
            count: data.count,
            averagePrice: (average / 1000) * elementPrice,
            highestPrice: (data.highest / 1000) * elementPrice
        };
    });

    // Sort visualization data by zone number
    visualizationData.sort((a, b) => {
        const zoneA = parseInt(a.name.split(' ')[1]);
        const zoneB = parseInt(b.name.split(' ')[1]);
        return zoneA - zoneB;
    });
}


  
function updateMetallurgicalCheckbox(checked) {
    metallurgicalTypes.forEach(type => {
        if (checked) {
            activeAssayTypes.add(type);
        } else {
            activeAssayTypes.delete(type);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    fetchElementPrices();
    const collapseElements = document.querySelectorAll('.collapse');
    const event = new Event('change');
    document.getElementById('elementSelect').dispatchEvent(event);

    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const value = this.value;
            
            if (['HY20', 'HN04', 'Rock', 'Source Sample', 'Shaft'].includes(value)) {
                if (this.checked) {
                    activeIncursionTypes.add(value);
                } else {
                    activeIncursionTypes.delete(value);
                }
            } else if (value === 'LMB+ (Metallurgical)') {
                updateMetallurgicalCheckbox(this.checked);
            } else if (['LMB Flux', 'LMB+', '4-Acid Dig'].includes(value)) {
                if (this.checked) {
                    activeAssayTypes.add(value);
                } else {
                    activeAssayTypes.delete(value);
                }
            } else if (['1', '2', '3', '4', '5', '6'].includes(value)) {
                if (this.checked) {
                    activeZones.add(value);
                } else {
                    activeZones.delete(value);
                }
            }

            // Ensure all checkboxes with the same value are updated
            document.querySelectorAll(`.checkbox-container input[value="${value}"]`).forEach(cb => {
                cb.checked = this.checked;
            });

            updateMap();
            updateElementTable();
            updateElementAverages();
        });
    });

    metallurgicalCheckboxes.forEach(checkbox => {
        checkbox.checked = metallurgicalTypes.some(type => activeAssayTypes.has(type));
        updateMetallurgicalCheckbox(checkbox.checked);
    });



    document.querySelectorAll('#elementTable th.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            updateElementTable();
            updateSortArrows();
        });
    });




        // Existing COA cell click event handler
        document.querySelector('#elementTable tbody').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('editable')) {
        const cellValue = e.target.textContent.trim();
        const fileUrl = coaFiles[cellValue];

        if (fileUrl) {
            document.getElementById('coaModalLabel').textContent = cellValue;
            const fileExtension = cellValue.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                document.getElementById('coaIframe').src = fileUrl;
                document.getElementById('coaIframe').style.display = 'block';
                document.getElementById('excelContainer').style.display = 'none';
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
                document.getElementById('coaIframe').src = viewerUrl;
                document.getElementById('coaIframe').style.display = 'block';
                document.getElementById('excelContainer').style.display = 'none';
            } else {
                document.getElementById('coaIframe').src = '';
                document.getElementById('coaIframe').style.display = 'none';
                document.getElementById('excelContainer').textContent = 'Cannot display the file. Unsupported file format.';
                document.getElementById('excelContainer').style.display = 'block';
            }

            const modal = new bootstrap.Modal(document.getElementById('coaModal'));
            modal.show();
        } else {
            alert('File not found.');
        }
    }
});



    function updateSortArrows() {
        document.querySelectorAll('#elementTable th.sortable').forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.getAttribute('data-column') === currentSortColumn) {
                if (currentSortDirection === 'asc') {
                    header.classList.add('sorted-asc');
                } else {
                    header.classList.add('sorted-desc');
                }
            }
        });
    }

   
    document.querySelectorAll('.overlay-checkbox-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                overlayImages[this.value].layer.addTo(map);
            } else {
                map.removeLayer(overlayImages[this.value].layer);
            }
        });
    });

    document.getElementById('darkModeToggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });




        
        collapseElements.forEach(collapse => {
            collapse.addEventListener('show.bs.collapse', function() {
                // Close all other open collapses
                collapseElements.forEach(otherCollapse => {
                    if (otherCollapse !== collapse && otherCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(otherCollapse).hide();
                    }
                });
    
                // Update arrow direction for the opening collapse
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    const arrow = button.querySelector('.filter-arrow');
                    if (arrow) arrow.textContent = '↑';
                }
            });
    
            collapse.addEventListener('hide.bs.collapse', function() {
                // Update arrow direction for the closing collapse
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    const arrow = button.querySelector('.filter-arrow');
                    if (arrow) arrow.textContent = '↓';
                }
            });
        });

    updateElementTable();
});