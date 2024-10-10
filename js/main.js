const coaFiles = {
    "Nexus_COA_Set_2.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_2.xlsx",
    "Nexus_COA_Set_NA.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_NA.xlsx",
    "Nexus_COA_SD.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_SD.xlsx",
    "Nexus_COA_Set_1.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_1.xlsx",
    "Nexus_COA_Set_0.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_0.xlsx",
    "Nexus_COA_Set_3.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_3.xlsx",
    "Nexus_COA_Set_4.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_4.xlsx",
    "Nexus_COA_Set_5.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_5.xlsx",
    "Nexus_COA_Set_6.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_6.xlsx",
    "Nexus_COA_Set_9.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_9.xlsx",
    "Nexus_COA_Set_20.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_20.xlsx",
    "Nexus_COA_Set_10.xlsx": "https://main--stellular-khapse-e51f2d.netlify.app/coas/Nexus_COA_Set_10.xlsx",
    "blank": "",
    "COA_RE20211599.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20211599.pdf",
    "COA_RE20206582.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20206582.pdf",
    "COA_RE20199978.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20199978.pdf",
    "COA_RE20185806.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20185806.pdf",
    "COA_RE20213510.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20213510.pdf",
    "COA_RE20162154.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20162154.pdf",
    "COA_RE20259732.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20259732.pdf",
    "COA_RE19312060.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE19312060.pdf",
    "COA_RE19316786.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE19316786.pdf",
    "COA_RE20066840.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20066840.pdf",
    "COA_RE20034549.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20034549.pdf",
    "COA_RE20066842.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20066842.pdf",
    "COA_RE20065194.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20065194.pdf",
    "COA_RE20124950.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20124950.pdf",
    "COA_RE20131728.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE20131728.pdf",
    "COA_RE21096417.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE21096417.pdf",
    "COA_RE21095480.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE21095480.pdf",
    "COA_RE21096266.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE21096266.pdf",
    "COA_RE21096307.pdf": "https://main--stellular-khapse-e51f2d.netlify.app/coas/COA_RE21096307.pdf"
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
    { symbol: "Hg", name: "Mercury", price: 1210 }, 
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
    { symbol: "Th", name: "Thorium", price: 287 }, 
    { symbol: "Ti", name: "Titanium", price: 9.58 },
    { symbol: "Tl", name: "Thallium", price: 6080 },
    { symbol: "U", name: "Uranium", price: 124 },
    { symbol: "V", name: "Vanadium", price: 22.9 },
    { symbol: "W", name: "Tungsten", price: 37.8 },
    { symbol: "Y", name: "Yttrium", price: 45 },
    { symbol: "Zn", name: "Zinc", price: 2.78 },
    { symbol: "Zr", name: "Zirconium", price: 37.4 },
    { symbol: "Dy", name: "Dysprosium", price: 307 },
    { symbol: "Er", name: "Erbium", price: 43.9 },
    { symbol: "Eu", name: "Europium", price: 263 },
    { symbol: "Gd", name: "Gadolinium", price: 28.6 },
    { symbol: "Ho", name: "Holmium", price: 60.3 },
    { symbol: "Lu", name: "Lutetium", price: 6900 },
    { symbol: "Nd", name: "Neodymium", price: 116 },
    { symbol: "Pr", name: "Praseodymium", price: 103 },
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
    let heatmapMode = 'average';
    let barChart = null;
    let pieChart = null;
    let rawSampleData = [];
    let rawElementData = {};
    let top20HighestData = [];
    let top20AverageData = [];    
    let isSortedByValue = false;
    let selectedIndices = [];
    let plssLayer;
    let iconSizeMode = 'fixed';
    let maxPPM = 0;
    let selectedElements = new Set(['Au']);
    let ownershipLayer;
    let blmClaimsLayer;
    let layerControl;
    let opacitySlider;
    let currentSortColumn = 'Element (PPM)';
    let currentSortDirection = 'desc';
    let activeZones = new Set(['1', '2', '3', '4', '5', '6']);
    let activeAssayTypes = new Set(['LMB Flux', 'LMB+']);
    let activeIncursionTypes = new Set(['HY20']);
        const overlayImages = {
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
            "Magnetic": {
                url: '/overlays/magnetic.png',
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


const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);


function showTooltip(event) {
    const target = event.currentTarget;
    const tooltipText = target.getAttribute('data-tooltip');
    tooltip.textContent = tooltipText;
    tooltip.style.display = 'block';
    const rect = target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
}

function hideTooltip() {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 300);
}

document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
});


$(document).ready(function() {
    $('#periodicModal').on('shown.bs.modal', function () {
        $(this).find('.modal-body').load('misc/periodic.html', function() {
            // Create a set of allowed elements
            const allowedElements = new Set(elementPricesData.map(el => el.symbol));

            $('.chip').each(function() {
                const elementSymbol = $(this).find('.face.front strong').text();
                if (!allowedElements.has(elementSymbol)) {
                    $(this).addClass('not-allowed')
                           .css({
                               'cursor': 'not-allowed',
                               'opacity': '0.5',
                               'transform': 'none',
                           });
                    $(this).find('.face').css('cursor', 'not-allowed');
                }
            });

            $('.chip').click(function() {

                if (!$(this).hasClass('not-allowed')) {
                    var elementName = $(this).find('.face.front strong').text();
                    var $dropdown = $('#elementSelect');
                    
                    $dropdown.val(elementName);
                    
                    setTimeout(function() {
                        $dropdown.trigger('change');
                        
                        var event = new Event('change', { bubbles: true });
                        $dropdown[0].dispatchEvent(event);
                    }, 10); 
                    
                    $('#periodicModal').modal('hide');
                }
            });
        });
    });
});

document.getElementById('removeCutoff').addEventListener('click', removeCutoff);

function removeCutoff() {
    const inputIds = ['minCutoff', 'maxCutoff'];

    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        } else {
            console.warn(`Input element with id '${id}' not found.`);
        }
    });

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

function getElementCategory(symbol) {
    const primaryElements = ['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag'];
    const secondaryElements = ['Rb', 'Cs', 'Sc'];
    
    if (primaryElements.includes(symbol)) return 'primary';
    if (secondaryElements.includes(symbol)) return 'secondary';
    return 'tertiary';
}

function getElementBackgroundColor(symbol) {
    const category = getElementCategory(symbol);
    switch (category) {
        case 'primary':
            return '#ffeb7e'; 
        case 'secondary':
            return '#d3f6b7'; 
        default:
            return '#e0e0e0'; 
    }
}


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

document.querySelector('.table-download').addEventListener('click', function() {
    const selectedElement = document.getElementById('elementSelect').value;
    const elementInfo = elementPricesData.find(el => el.symbol === selectedElement);
    const backgroundColor = getElementBackgroundColor(selectedElement);
    
    // Get selected assay types
    const selectedAssayTypes = Array.from(activeAssayTypes);

    // Determine the data type being exported
    let dataType = '';

    // Format assay types for display
    const assayTypesString = selectedAssayTypes.map(type => {
        switch(type) {
            case 'LMB Flux': return 'LMB Flux';
            case 'LMB+': return 'LMB+';
            case '4-Acid Dig': return '4-Acid';
            case 'Metallurgical (Aqua Regia)': return 'Metallurgical';
            default: return type;
        }
    }).join(', ');
    
    // Get selected incursion types
    const selectedIncursionTypes = Array.from(activeIncursionTypes).map(type => {
        switch(type) {
            case 'HY20': return '20-Foot';
            case 'HN04': return '4-Foot';
            default: return type;
        }
    }).join(', ');
    
    // Get cut-off grade values
    const minCutoff = document.getElementById('minCutoff').value;
    const maxCutoff = document.getElementById('maxCutoff').value;
    
    let confirmMessage = `You are about to export <span class="export-highlight">${dataType}</span> data for <div class="export-highlight modalSelectedElementContainer">
        <span class="modalSelectedElementName">${elementInfo ? elementInfo.name : ''}</span>
        <span class="modalSelectedElement" style="background-color: ${backgroundColor};">${selectedElement}</span>
    </div> Assayed with <span class="export-highlight">${assayTypesString}</span> for <span class="export-highlight">${selectedIncursionTypes}</span> Incursion(s).`;
    
    if (minCutoff || maxCutoff) {
        confirmMessage += ` with Cut-off grade of `;
        if (minCutoff) confirmMessage += `<span class="export-highlight">Min ${minCutoff} ppm</span>`;
        if (minCutoff && maxCutoff) confirmMessage += ` and `;
        if (maxCutoff) confirmMessage += `<span class="export-highlight">Max ${maxCutoff} ppm</span>`;
    }
    
    document.getElementById('exportConfirmBody').innerHTML = confirmMessage;
    const modal = new bootstrap.Modal(document.getElementById('exportConfirmModal'));
    modal.show();
});

document.getElementById('confirmExportBtn').addEventListener('click', function() {
    const selectedElement = document.getElementById('elementSelect').value;
    const filename = `RRCM_Table_Element_${selectedElement}_${new Date().toISOString().slice(0,10)}.csv`;
    exportTableToCSV(filename);
    const modal = bootstrap.Modal.getInstance(document.getElementById('exportConfirmModal'));
    modal.hide();
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

document.getElementById('elementPricesModal').addEventListener('hidden.bs.modal', () => {
    const checkboxes = document.querySelectorAll('.element-price-card input[type="checkbox"]');
    selectedElements.clear();
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedElements.add(checkbox.id.replace('checkbox-', ''));
        }
    });
});

function updateElementPricesModal() {
    const container = document.getElementById('elementPricesContainer');
    container.innerHTML = '';

    const categories = [
        {
            name: "Primary",
            subtext: "Precious Metals",
            elements: ['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag']
        },
        {
            name: "Secondary",
            subtext: "Targeted High Value Elements",
            elements: ['Rb', 'Cs', 'Sc']
        },
        {
            name: "Tertiary",
            subtext: "Other Possible Targeted Elements",
            elements: elementPricesData.map(el => el.symbol).filter(symbol => 
                !['Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Ag', 'Rb', 'Cs', 'Sc'].includes(symbol)
            )
        }
    ];

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'col-12 mb-4';
        categoryDiv.innerHTML = `
            <h4>${category.name}</h4>
            <p class="text-muted" style="font-size: 0.8em; margin-top: -10px; text-align: center;">${category.subtext}</p>
        `;
        
        const row = document.createElement('div');
        row.className = 'row';

        let elements = category.elements.map(symbol => elementPricesData.find(el => el.symbol === symbol)).filter(el => el);

        if (isSortedByValue) {
            elements.sort((a, b) => b.price - a.price);
        }

        elements.forEach(elementInfo => {
            const pricePerGram = elementInfo.price / 1000;
            const card = document.createElement('div');
            card.className = 'col-md-4 col-sm-6 mb-3';
            card.innerHTML = `
                <div class="element-price-card" data-element="${elementInfo.symbol}">
                    <input type="checkbox" id="checkbox-${elementInfo.symbol}" ${elementInfo.symbol === selectedElement ? 'checked' : ''}>
                    <label for="checkbox-${elementInfo.symbol}">
                        <div class="element-symbol">${elementInfo.symbol}</div>
                        <div class="element-name">${elementInfo.name}</div>
                        <div class="element-price">$${pricePerGram.toFixed(2)}/g</div>
                    </label>
                </div>
            `;
            row.appendChild(card);
        });

        categoryDiv.appendChild(row);
        container.appendChild(categoryDiv);
    });

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'col-12 text-center mt-3';
    timestampDiv.textContent = `Last updated: ${lastUpdated ? lastUpdated.toLocaleString() : 'Never'}`;
    container.appendChild(timestampDiv);
    container.querySelectorAll('.element-price-card').forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const label = card.querySelector('label');

        checkbox.addEventListener('change', function(event) {
            event.stopPropagation();
            selectElement(this.id.replace('checkbox-', ''));
        });

        label.addEventListener('click', function(event) {
            event.preventDefault();
            const elementSymbol = this.closest('.element-price-card').dataset.element;
            selectElement(elementSymbol);

            const modal = bootstrap.Modal.getInstance(document.getElementById('elementPricesModal'));
            modal.hide();
        });
    });
}

function selectElement(elementSymbol) {
    selectedElement = elementSymbol;
    
    document.querySelectorAll('.element-price-card input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.id === `checkbox-${elementSymbol}`;
    });

    const elementSelect = document.getElementById('elementSelect');
    elementSelect.value = elementSymbol;
    
    const changeEvent = new Event('change');
    elementSelect.dispatchEvent(changeEvent);
}

document.getElementById('sortElementsBtn').addEventListener('click', function() {
    isSortedByValue = !isSortedByValue;
    this.textContent = isSortedByValue ? 'Return to default view' : 'Sort by Value';
    updateElementPricesModal();
});


document.getElementById('elementPricesBtn').addEventListener('click', () => {
    if (Object.keys(elementPrices).length === 0) {
        fetchElementPrices();
    }
    isSortedByValue = false;
    document.getElementById('sortElementsBtn').textContent = 'Sort by Value';
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
            attribution: '&copy; BGS 2024'
        });
    
        const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; BGS 2024'
        });
    
        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; BGS 2024'
        });
    
    
        const esriWorldStreetMap = L.tileLayer.provider('Esri.WorldStreetMap', {
            attribution: '&copy; BGS 2024'
        });
    
        const usgsUSTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 20,
            attribution: '&copy; BGS 2024'
        });
    
        const usgsUSImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 20,
            attribution: '&copy; BGS 2024'
        });


    
        map = L.map('map', {
            layers: [satelliteLayer]
        }).setView([0, 0], 2);
    
        const baseLayers = {
            "Satellite": satelliteLayer,
            "Sat + Topo": usgsUSImageryTopo,
            "Topographic": topoLayer,
            "USGS Topo": usgsUSTopo,
            "Street": streetLayer,
            "Esri Street": esriWorldStreetMap
        };
    
        for (let key in overlayImages) {
            overlayImages[key].layer = L.imageOverlay(overlayImages[key].url, overlayImages[key].bounds);
            setInitialLayerOpacity(overlayImages[key].layer);
            if (key === "Zone") {
                overlayImages[key].layer.addTo(map);
            }
        }    
    
        layerControl = L.control.layers(baseLayers).addTo(map);
    
        map.on('overlayadd', function(event) {
            updateSidebarCheckbox(event.name, true);
        });
    
        map.on('overlayremove', function(event) {
            updateSidebarCheckbox(event.name, false);
        });
    }
    
    

    function updateSidebarCheckbox(layerName, isChecked) {
        document.querySelectorAll(`.overlay-checkbox-container input[value="${layerName}"]`).forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }
    

    function convertUTMToLatLng(northing, easting) {
        const utm = "+proj=utm +zone=11 +datum=WGS84";
        const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
        const result = proj4(utm, wgs84, [parseFloat(easting), parseFloat(northing)]);
        return [result[1], result[0]];
    }

    function addBLMClaimsOverlay() {
        return new Promise((resolve, reject) => {
            if (blmClaimsLayer) {
                map.addLayer(blmClaimsLayer);
                resolve();
            } else {
                fetch('overlays/BLM_Natl_MLRS_Mining_Claims_-_Not_Closed.geojson')
                    .then(response => response.json())
                    .then(data => {
                        const currentOpacity = getCurrentOpacity();
                        blmClaimsLayer = L.geoJSON(data, {
                            style: function(feature) {
                                return {
                                    color: '#34eb62',
                                    weight: 2,
                                    opacity: 0.40,
                                    fillOpacity: 0.2
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                if (feature.properties) {
                                    let blmProd = feature.properties.BLM_PROD || 'N/A';
                                    let cseName = feature.properties.CSE_NAME || 'N/A';
                                    let cseDisp = feature.properties.CSE_DISP || 'N/A';
                                    let rcrdAcrs = feature.properties.RCRD_ACRS || 'N/A';
                                    let created = feature.properties.Created || 'N/A';
                                    let modified = feature.properties.Modified || 'N/A';
    
                                    let tooltipContent = `
                                        <div class="blm-claims-tooltip">
                                            <strong>BLM_PROD:</strong> ${blmProd}<br>
                                            <strong>CSE_NAME:</strong> ${cseName}<br>
                                            <strong>CSE_DISP:</strong> ${cseDisp}<br>
                                            <strong>RCRD_ACRS:</strong> ${rcrdAcrs}<br>
                                            <strong>Created:</strong> ${created}<br>
                                            <strong>Modified:</strong> ${modified}
                                        </div>`;
                                    
                                    layer.bindTooltip(tooltipContent, {
                                        permanent: false,
                                        direction: 'top',
                                        className: 'blm-claims-tooltip',
                                        sticky: true
                                    });
                                    
                                    let popupContent = '<b>BLM Claim Info:</b><br>';
                                    for (let key in feature.properties) {
                                        popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                                    }
                                    
                                    layer.bindPopup(popupContent);
                                }
                            
                                setInitialLayerOpacity(blmClaimsLayer);}
                        });
                        
                        map.addLayer(blmClaimsLayer);
                        
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error loading BLM Claims data:', error);
                        reject(error);
                    });
            }
        });
    }
    


    function addOwnershipOverlay() {
        return new Promise((resolve, reject) => {
            if (ownershipLayer) {
                map.addLayer(ownershipLayer);
                resolve();
            } else {
                fetch('overlays/California_Land_Ownership.geojson')
                    .then(response => response.json())
                    .then(data => {
                        const currentOpacity = getCurrentOpacity();
                        ownershipLayer = L.geoJSON(data, {
                            style: function(feature) {
                                return {
                                    color: '#4a83ec',
                                    weight: 1,
                                    opacity: 0.65,
                                    fillOpacity: 0.1
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                if (feature.properties) {
                                    let ownLevel = feature.properties.OWN_LEVEL || 'Unknown';
                                    let ownAgency = feature.properties.OWN_AGENCY || 'Unknown';
                                    let ownGroup = feature.properties.OWN_GROUP || 'Unknown';
    
                                    let tooltipContent = `
                                        <div class="ownership-tooltip">
                                            <strong>OWN_LEVEL:</strong> ${ownLevel}<br>
                                            <strong>OWN_AGENCY:</strong> ${ownAgency}<br>
                                            <strong>OWN_GROUP:</strong> ${ownGroup}
                                        </div>`;
                                    
                                    layer.bindTooltip(tooltipContent, {
                                        permanent: false,
                                        direction: 'top',
                                        className: 'ownership-tooltip',
                                        sticky: true // Makes the tooltip follow the cursor
                                    });
                                    
                                    let popupContent = '<b>Ownership Info:</b><br>';
                                    for (let key in feature.properties) {
                                        popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                                    }
                                    
                                    layer.bindPopup(popupContent);
                                }
                                setInitialLayerOpacity(ownershipLayer);
                            }
                        });
                        
                        map.addLayer(ownershipLayer);
                        
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error loading Land Ownership data:', error);
                        reject(error);
                    });
            }
        });
    }
    

    function addPLSSOverlay() {
        return new Promise((resolve, reject) => {
            if (plssLayer) {
                map.addLayer(plssLayer);
                plssLayerAdded = true;
                resolve();
            } else {
                fetch('overlays/Public_Land_Survey_System_(PLSS)__Sections.geojson')
                    .then(response => response.json())
                    .then(data => {
                        const currentOpacity = getCurrentOpacity();
                        plssLayer = L.geoJSON(data, {
                            style: function(feature) {
                                return {
                                    color: '#ff7800',
                                    weight: 1,
                                    opacity: 0.65,
                                    fillOpacity: 0.1
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                if (feature.properties) {
                                    let townshipProp = Object.keys(feature.properties).find(key => key.toLowerCase().includes('town'));
                                    let rangeProp = Object.keys(feature.properties).find(key => key.toLowerCase().includes('range'));
                                    let sectionProp = Object.keys(feature.properties).find(key => key.toLowerCase().includes('section'));
                                    
                                    let township = feature.properties[townshipProp] || 'N/A';
                                    let range = feature.properties[rangeProp] || 'N/A';
                                    let section = feature.properties[sectionProp] || 'N/A';
                                    
    
                                    let tooltipContent = `<div class="custom-plss-tooltip">
                                                            <strong>Township:</strong> ${township}<br>
                                                            <strong>Range:</strong> ${range}<br>
                                                            <strong>Section:</strong> ${section}
                                                          </div>`;
                                    
                                    layer.bindTooltip(tooltipContent, {
                                        permanent: false,
                                        direction: 'top',
                                        className: 'plss-tooltip'
                                    });
                                    
                                    let popupContent = '<b>PLSS Info:</b><br>';
                                    for (let key in feature.properties) {
                                        popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                                    }
                                    
                                    layer.bindPopup(popupContent);
                                }
                                setInitialLayerOpacity(plssLayer);
                            }
                        });
                        
                        map.addLayer(plssLayer);
                        plssLayerAdded = true;
                        
                        
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error loading PLSS data:', error);
                        reject(error);
                    });
            }
        });
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
        hideViewTop20Button();
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
            showViewTop20Button();
        }
        
      function createCustomIcon(dh, incursionType, avgPPM, highestPPM) {
        const showDHLabels = document.getElementById('showDHLabels').checked;
    
        if (iconSizeMode === 'fixed') {
            // Fixed size mode
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
            } else { // This will handle 'HY20' (20-foot incursion) and any other types
                return L.divIcon({
                    className: 'custom-div-icon',
                    html: dh, // Always show label for HY20 in fixed size mode
                    iconSize: [11, 11],
                    iconAnchor: [5, 5],
                    popupAnchor: [0, -11],
                });
            }
        } else {
            // Variable size mode (highest or average)
            let size = 10; // Default size
            const ppm = iconSizeMode === 'average' ? avgPPM : highestPPM;
            size = Math.max(8, Math.min(30, 8 + (ppm / maxPPM) * 22)); // Scale size between 8 and 30
    
            let className;
            switch (incursionType) {
                case 'HY20':
                    className = 'circle-icon white-circle';
                    break;
                case 'HN04':
                    className = 'circle-icon red-circle';
                    break;
                case 'Rock':
                    className = 'circle-icon purple-circle';
                    break;
                case 'Source Sample':
                    className = 'circle-icon yellow-circle';
                    break;
                case 'Shaft':
                    className = 'circle-icon green-circle';
                    break;
                default:
                    className = 'circle-icon white-circle';
            }
    
            const labelHtml = showDHLabels ? `<span class="icon-label">${dh}</span>` : '';
    
            return L.divIcon({
                className: className,
                html: labelHtml,
                iconSize: [size, size],
                iconAnchor: [size/2, size/2],
                popupAnchor: [0, -size/2],
            });
        }
    }

document.getElementById('iconSizeMode').removeEventListener('change', function() {
    iconSizeMode = this.value;
    updateDHLabelsVisibility();
    updateMap();
    updateLegend();
});

document.querySelectorAll('input[name="iconSizeMode"]').forEach(radio => {
    radio.addEventListener('change', function() {
        iconSizeMode = this.value;
        updateDHLabelsVisibility();
        updateMap();
        updateLegend();
    });
});


function updateDHLabelsVisibility() {
    const dhLabelsControl = document.getElementById('dhLabelsControl');
    if (iconSizeMode === 'fixed') {
        dhLabelsControl.style.display = 'none';
    } else {
        dhLabelsControl.style.display = 'block';
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
    const mapLegend = document.querySelector('.legend-wrapper');
    const heatmapLegend = document.getElementById('heatmapLegend');

    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
        document.getElementById('toggleHeatmapButton').textContent = 'Show Heat Map';
        heatmapLegend.style.display = 'none';
        mapLegend.classList.remove('hidden');
        heatmapEnabled = false;
    } else {
        const heatData = calculateHeatmapData(selectedElement, heatmapMode);
        heatLayer = L.heatLayer(heatData.data, { radius: 25, maxZoom: 12 }).addTo(map);
        document.getElementById('toggleHeatmapButton').textContent = 'Hide Heat Map';
        heatmapLegend.style.display = 'block';
        mapLegend.classList.add('hidden');
        updateHeatmapLegend(heatData.maxPPM);
        heatmapEnabled = true;
    }
}

function initializeLegends() {
    const mapLegend = document.querySelector('.legend-wrapper');
    const heatmapLegend = document.getElementById('heatmapLegend');

    if (heatmapEnabled) {
        mapLegend.classList.add('hidden');
        heatmapLegend.style.display = 'block';
    } else {
        mapLegend.classList.remove('hidden');
        heatmapLegend.style.display = 'none';
    }
}

function updateLegend() {
    const legendWrapper = document.getElementById('legendWrapper');
    if (iconSizeMode === 'fixed') {
        legendWrapper.innerHTML = `
            <h5>Map Legend</h5>
            <div class="legend-item">
                <div class="point-dot custom-div-icon" style="background: #fff; border: 1px solid #000; margin-left: 2px;">DH</div>
                <span class="legend-text">20ft Incursion</span>
            </div>
            <div class="legend-item">
                <div class="point-dot red-dot-icon" style="margin-left: 2px;"></div>
                <span class="legend-text">4ft Incursion</span>
            </div>
            <div class="legend-item">
                <img src="overlays/shafticon.png" alt="Shaft" style="width: 26px; height: 26px; margin-right: 8px">
                <span class="legend-text">Shaft</span>
            </div>
            <div class="legend-item">
                <div class="point-dot source-icon icon-width"></div>
                <span class="legend-text">Source Sample</span>
            </div>
            <div class="legend-item">
                <div class="point-dot purple-rectangle-icon icon-width"></div>
                <span class="legend-text">Rock</span>
            </div>
        `;
    } else {
        legendWrapper.innerHTML = `
            <h5>Map Legend</h5>
            <div class="legend-item">
                <div class="circle-icon white-circle" style="width: 15px; height: 15px;"></div>
                <span class="legend-text">20ft Incursion</span>
            </div>
            <div class="legend-item">
                <div class="circle-icon red-circle" style="width: 15px; height: 15px;"></div>
                <span class="legend-text">4ft Incursion</span>
            </div>
            <div class="legend-item">
                <div class="circle-icon green-circle" style="width: 15px; height: 15px;"></div>
                <span class="legend-text">Shaft</span>
            </div>
            <div class="legend-item">
                <div class="circle-icon yellow-circle" style="width: 15px; height: 15px;"></div>
                <span class="legend-text">Source Sample</span>
            </div>
            <div class="legend-item">
                <div class="circle-icon purple-circle" style="width: 15px; height: 15px;"></div>
                <span class="legend-text">Rock</span>
            </div>
        `;
    }
}


document.getElementById('heatmapModeButton').addEventListener('click', () => {
    heatmapMode = heatmapMode === 'average' ? 'highest' : 'average';
    document.getElementById('heatmapModeButton').textContent = heatmapMode === 'average' ? 'Heat Map by Highest ppm' : 'Heat Map by Average ppm';

 
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
    maxPPM = 0;

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
                    uniquePoints.set(key, { indices: [], totalPPM: 0, highestPPM: -Infinity });
                }
                const point = uniquePoints.get(key);
                point.indices.push(index);
                point.totalPPM += elementValue;
                point.highestPPM = Math.max(point.highestPPM, elementValue);
                maxPPM = Math.max(maxPPM, point.highestPPM);
            }
        }
    });

    uniquePoints.forEach((point, key) => {
        const [lat, lng, dh] = key.split(',');
        const avgPPM = point.totalPPM / point.indices.length;
        const marker = L.marker([parseFloat(lat), parseFloat(lng)], { 
            icon: createCustomIcon(dh, sampleData[point.indices[0]]['Incursion Type'], avgPPM, point.highestPPM, iconSizeMode) 
        }).addTo(map);
        
        const tooltipContent = generateTooltipContent(point.indices);
        marker.bindTooltip(tooltipContent, { className: 'custom-tooltip' });
        marker.bindPopup(() => createPopupContent(point.indices));
        marker.on('click', () => filterTableByPoint(point.indices));
        marker.on('popupclose', () => clearPointSelection());
        markers.push(marker);
    });

    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }

    updateHeatmapIfEnabled(selectedElement);
    updateElementTable();
}

function updateHeatmapIfEnabled(selectedElement) {
    if (heatmapEnabled) {
        const heatData = calculateHeatmapData(selectedElement, heatmapMode);
        heatLayer = L.heatLayer(heatData.data, { radius: 25, maxZoom: 12 }).addTo(map);
        updateHeatmapLegend(heatData.maxPPM);
    }
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
    const csvFileUrl = 'https://main--stellular-khapse-e51f2d.netlify.app/mapdata.csv';
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

function updateSelectedElementDisplay() {
    const selectedElement = document.getElementById('elementSelect').value;
    const elementInfo = elementPricesData.find(el => el.symbol === selectedElement);
    const backgroundColor = getElementBackgroundColor(selectedElement);
    

    if (elementInfo) {
        document.getElementById('selectedElementName').textContent = elementInfo.name;
        document.getElementById('selectedElement').textContent = elementInfo.symbol;
        document.getElementById('selectedElement').style.backgroundColor = backgroundColor;
    } else {
        document.getElementById('selectedElementName').textContent = '';
        document.getElementById('selectedElement').textContent = selectedElement;
        document.getElementById('selectedElement').style.backgroundColor = backgroundColor;
    } if (elementInfo) {
        document.getElementById('modalSelectedElementName').textContent = elementInfo.name;
        document.getElementById('modalSelectedElement').textContent = elementInfo.symbol;
        document.getElementById('modalSelectedElement').style.backgroundColor = backgroundColor;
    } else {
        document.getElementById('modalSelectedElementName').textContent = '';
        document.getElementById('modalSelectedElement').textContent = selectedElement;
        document.getElementById('modalSelectedElement').style.backgroundColor = backgroundColor;
    }
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


// Modify the elementSelect change event listener
document.getElementById('elementSelect').addEventListener('change', () => {
    const selectedElementSymbol = document.getElementById('elementSelect').value;
    const elementInfo = elementPricesData.find(el => el.symbol === selectedElementSymbol);
    
    if (elementInfo) {
        document.getElementById('selectedElementName').textContent = elementInfo.name;
        document.getElementById('selectedElement').textContent = elementInfo.symbol;
        selectedElement = selectedElementSymbol;
    } else {
        document.getElementById('selectedElementName').textContent = '';
        document.getElementById('selectedElement').textContent = selectedElementSymbol;
    }

    // Update the checkboxes in the modal if it's open
    document.querySelectorAll('.element-price-card input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.id === `checkbox-${selectedElementSymbol}`;
    });

    updateSelectedElementDisplay();
    updateElementTable();
    updateMap();
    updateSelectedDHAverage();
    updateElementAverages();
    updateZoneAverages();
    if (document.getElementById('visualizationModal').classList.contains('show')) {
        renderCharts();
    }
});

function hideViewTop20Button() {
    const viewTop20Button = document.getElementById('viewTop20Button');
    if (viewTop20Button) {
        viewTop20Button.style.display = 'none';
    }
}

function showViewTop20Button() {
    const viewTop20Button = document.getElementById('viewTop20Button');
    if (viewTop20Button) {
        viewTop20Button.style.display = 'block';
    }
}

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

document.getElementById('showDHLabels').addEventListener('change', function() {
    if (iconSizeMode !== 'fixed') {
        updateMap();
    }
});



     // Function to set initial opacity for layers when they are added
     function setInitialLayerOpacity(layer) {
        const opacity = opacitySlider ? opacitySlider.value / 100 : 1;
        if (layer instanceof L.ImageOverlay) {
            layer.setOpacity(opacity);
        } else if (layer instanceof L.GeoJSON) {
            layer.setStyle({
                fillOpacity: opacity * (layer === blmClaimsLayer ? 0.2 : 0.1),
                opacity: opacity * (layer === blmClaimsLayer ? 0.4 : 0.65)
            });
        }
    }

    function getCurrentOpacity() {
        return opacitySlider ? opacitySlider.value / 100 : 1;
    }

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    fetchElementPrices();
    updateSelectedElementDisplay();
    updateDHLabelsVisibility();
    initializeLegends();
    opacitySlider = document.getElementById('overlayOpacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    const collapseElements = document.querySelectorAll('.collapse');
    const event = new Event('change');
    document.getElementById('elementSelect').dispatchEvent(event);

    opacitySlider.addEventListener('input', function() {
        const opacity = this.value / 100;
        opacityValue.textContent = this.value + '%';

        for (let key in overlayImages) {
            if (overlayImages[key].layer && map.hasLayer(overlayImages[key].layer)) {
                overlayImages[key].layer.setOpacity(opacity);
            }
        }

        if (blmClaimsLayer && map.hasLayer(blmClaimsLayer)) {
            blmClaimsLayer.setStyle({ fillOpacity: opacity * 0.2, opacity: opacity * 0.4 });
        }
        if (plssLayer && map.hasLayer(plssLayer)) {
            plssLayer.setStyle({ fillOpacity: opacity * 0.1, opacity: opacity * 0.65 });
        }
        if (ownershipLayer && map.hasLayer(ownershipLayer)) {
            ownershipLayer.setStyle({ fillOpacity: opacity * 0.1, opacity: opacity * 0.65 });
        }
    });



    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const value = this.value;
        
        if (['HY20', 'HN04', 'Rock', 'Source Sample', 'Shaft'].includes(value)) {
            if (this.checked) {
                activeIncursionTypes.add(value);
            } else {
                activeIncursionTypes.delete(value);
            }
        } else if (['LMB Flux', 'LMB+', '4-Acid Dig', 'Metallurgical'].includes(value)) {
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

        document.querySelectorAll(`.checkbox-container input[value="${value}"]`).forEach(cb => {
            cb.checked = this.checked;
        });

        updateMap();
        updateElementTable();
        updateElementAverages();
    });
});



    const infoPopup = document.getElementById('infoPopup');
    infoPopup.style.display = 'block';

    // Close the popup when the close button is clicked
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        infoPopup.style.display = 'none';
    });

    // Close the popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === infoPopup) {
            infoPopup.style.display = 'none';
        }
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
            const layerName = this.value;
            const currentOpacity = getCurrentOpacity();
    
            if (this.checked) {
                if (layerName === "PLSS") {
                    addPLSSOverlay().then(() => {
                        map.addLayer(plssLayer);
                        plssLayer.setStyle({
                            fillOpacity: currentOpacity * 0.1,
                            opacity: currentOpacity * 0.65
                        });
                    });
                } else if (layerName === "Ownership") {
                    addOwnershipOverlay().then(() => {
                        map.addLayer(ownershipLayer);
                        ownershipLayer.setStyle({
                            fillOpacity: currentOpacity * 0.1,
                            opacity: currentOpacity * 0.65
                        });
                    });
                } else if (layerName === "BLMClaims") {
                    addBLMClaimsOverlay().then(() => {
                        map.addLayer(blmClaimsLayer);
                        blmClaimsLayer.setStyle({
                            fillOpacity: currentOpacity * 0.2,
                            opacity: currentOpacity * 0.4
                        });
                    });
                } else if (overlayImages[layerName]) {
                    overlayImages[layerName].layer.setOpacity(currentOpacity);
                    map.addLayer(overlayImages[layerName].layer);
                }
            } else {
                if (layerName === "PLSS" && plssLayer) {
                    map.removeLayer(plssLayer);
                } else if (layerName === "Ownership" && ownershipLayer) {
                    map.removeLayer(ownershipLayer);
                } else if (layerName === "BLMClaims" && blmClaimsLayer) {
                    map.removeLayer(blmClaimsLayer);
                } else if (overlayImages[layerName]) {
                    map.removeLayer(overlayImages[layerName].layer);
                }
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
    
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    const arrow = button.querySelector('.filter-arrow');
                    if (arrow) arrow.textContent = '↑';
                }
            });
    
            collapse.addEventListener('hide.bs.collapse', function() {
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    const arrow = button.querySelector('.filter-arrow');
                    if (arrow) arrow.textContent = '↓';
                }
            });
        });


        function loadTop20Data() {
            const csvFileUrl = 'https://main--stellular-khapse-e51f2d.netlify.app/mapdata.csv';
            const timestamp = new Date().getTime();
            fetch(`${csvFileUrl}?t=${timestamp}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    parseTop20CSV(text);
                    calculateTop20Elements();
                })
                .catch(error => {
                    console.error('Error loading the CSV file for Top 20:', error);
                });
        }
      
function parseTop20CSV(text) {
    const lines = text.trim().split('\n');
    rawSampleData = lines.slice(1).map(line => {
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

        
          
    lines.slice(1).forEach((line, rowIndex) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        elements.forEach((element, elementIndex) => {
            const elementColumnIndex = headers.length + elementIndex;
            let value = values[elementColumnIndex] ? values[elementColumnIndex].trim() : '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            value = value.replace(/,/g, ''); 
            rawElementData[rowIndex] = rawElementData[rowIndex] || {};
            rawElementData[rowIndex][element] = value;
        });
    });
}

function calculateTop20Elements() {
    const selectedZone = document.querySelector('input[name="zoneFilter"]:checked').value;
    let highestData = [];
    let averageData = [];

    elements.forEach(element => {
        let highest = -Infinity;
        let total = 0;
        let count = 0;

        rawSampleData.forEach((sample, index) => {
            if ((selectedZone === 'all' || sample.Zone === selectedZone) &&
                sample['Incursion Type'] === 'HY20' &&
                (sample['Assay Type'] === 'LMB Flux' || sample['Assay Type'] === 'LMB+')) {
                
                const elementValue = rawElementData[index] && rawElementData[index][element] ? 
                                     parseFloat(rawElementData[index][element].replace(/["',]/g, '')) : NaN;

                if (!isNaN(elementValue)) {
                    highest = Math.max(highest, elementValue);
                    total += elementValue;
                    count++;
                }
            }
        });

        const average = count > 0 ? total / count : 0;
        const elementPrice = elementPricesData.find(el => el.symbol === element)?.price || 0;
        const highestValuePerTonne = (highest / 1000) * elementPrice;
        const averageValuePerTonne = (average / 1000) * elementPrice;

        highestData.push({
            element,
            highest,
            highestValuePerTonne
        });

        averageData.push({
            element,
            average,
            averageValuePerTonne
        });
    });

    top20HighestData = highestData.sort((a, b) => b.highestValuePerTonne - a.highestValuePerTonne).slice(0, 20);
    top20AverageData = averageData.sort((a, b) => b.averageValuePerTonne - a.averageValuePerTonne).slice(0, 20);

    updateTop20Tables();
    updateTop20Charts();
}
        
function updateTop20Tables() {
    updateTop20Table('top20AverageTable', top20AverageData, 'average');
    updateTop20Table('top20HighestTable', top20HighestData, 'highest');
}

function updateTop20Table(tableId, data, type) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) {
        return;
    }
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        const ppmValue = type === 'highest' ? item.highest : item.average;
        const valuePerTonne = type === 'highest' ? item.highestValuePerTonne : item.averageValuePerTonne;
        
        // Special handling for Iridium (Ir)
        const isIridium = item.element === 'Ir';
        const tenKTonneProduction = isIridium 
            ? (ppmValue * 10000) / 1000 
            : Math.round((ppmValue * 10000) / 1000);
        const annualFigure = isIridium 
            ? tenKTonneProduction * 365 
            : Math.round(tenKTonneProduction * 365);

        const tenKTonnePrice = Math.round(valuePerTonne * 10000);
        const annualPrice = Math.round(valuePerTonne * 10000 * 365);

        row.innerHTML = `
            <td>${item.element}</td>
            <td class="${type}-value-2">${formatNumberWithCommas(ppmValue.toFixed(2))}</td>
            <td class="dollar-value-2">$${formatNumberWithCommas(valuePerTonne.toFixed(2))}</td>
            <td class="kg-data" data-price="${tenKTonnePrice}">
                ${isIridium ? formatNumberWithCommas(tenKTonneProduction.toFixed(2)) : formatNumberWithCommas(tenKTonneProduction)}
            </td>
            <td class="kg-data" data-price="${annualPrice}">
                ${isIridium ? formatNumberWithCommas(annualFigure.toFixed(2)) : formatNumberWithCommas(annualFigure)}
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add tooltips to kg-data cells
    const kgCells = tbody.querySelectorAll('.kg-data');
    kgCells.forEach(cell => {
        const price = parseInt(cell.dataset.price);
        const formattedPrice = formatNumberWithCommas(price);
        
        cell.style.position = 'relative';
        cell.style.cursor = 'pointer';

        const tooltip = document.createElement('div');
        tooltip.textContent = `Price: $${formattedPrice}`;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 5px;
            background-color: #333;
            color: #28a745;
            border-radius: 3px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 1000;
        `;

        cell.appendChild(tooltip);

        cell.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        cell.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

function updateTop20Charts() {
    updateBarChart('highestValueChart', 'Highest Value ($/tonne)', top20HighestData);
    updateBarChart('averageValueChart', 'Average Value ($/tonne)', top20AverageData);
}

function updateBarChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas with id ${canvasId} not found`);
        return;
    }
    
    if (window[canvasId] && typeof window[canvasId].destroy === 'function') {
        window[canvasId].destroy();
    }

    const isHighestChart = canvasId === 'highestValueChart';

    window[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.element),
            datasets: [{
                label: label,
                data: isHighestChart ? data.map(d => d.highestValuePerTonne) : data.map(d => d.averageValuePerTonne),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '$/tonne'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: label
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '$' + formatNumberWithCommas(context.parsed.y.toFixed(2)) + '/tonne';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}
        
        document.getElementById('viewTop20Button').addEventListener('click', () => {
            if (rawSampleData.length === 0) {
                loadTop20Data();
            } else {
                calculateTop20Elements();
            }
            const modal = new bootstrap.Modal(document.getElementById('top20Modal'));
            modal.show();
        });
        
        document.querySelectorAll('input[name="zoneFilter"]').forEach(radio => {
            radio.addEventListener('change', () => {
                calculateTop20Elements();
            });
        });

    

    updateElementTable();
    loadTop20Data();
});

