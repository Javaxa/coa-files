// JavaScript
$(document).ready(function() {
    let allItems = [];
    let currentItem = null;
    let selectedCategory = "all";
    let selectedStorage = "all";

    // Load CSV data
    function loadCSVData() {
        Papa.parse("warehouse_supply_data.csv", {
            download: true,
            header: true,
            complete: function(results) {
                allItems = results.data.map(item => {
                    // Ensure NotifyThreshold is included in each item
                    if (!item.hasOwnProperty('NotifyThreshold')) {
                        item.NotifyThreshold = '';
                    }
                    return item;
                });
                displayItems(allItems);
                populateStorageFilter();
            },
            error: function(error) {
                console.error("Error parsing CSV:", error);
            }
        });
    }
    

    // Initial load
    loadCSVData();

    function populateStorageFilter() {
        const storageInfoSet = new Set(allItems.map(item => item["Storage_Information"]));
        const container = $("#storageRadios");
        container.empty();
        
        // Add "All Storages" option
        const allStoragesId = "storage-all";
        const allStoragesRadio = $("<input>")
            .attr("type", "radio")
            .attr("id", allStoragesId)
            .attr("name", "storage")
            .attr("value", "all")
            .addClass("storage-radio")
            .prop("checked", true);
        const allStoragesLabel = $("<label>")
            .attr("for", allStoragesId)
            .text("All Storages");
        container.append(allStoragesRadio, allStoragesLabel);
    
        // Sort storage locations alphabetically
        const sortedStorageInfo = Array.from(storageInfoSet).sort((a, b) => a.localeCompare(b));
    
        sortedStorageInfo.forEach(storageInfo => {
            if (storageInfo) {
                const id = `storage-${storageInfo.replace(/\s+/g, '-').toLowerCase()}`;
                const radio = $("<input>")
                    .attr("type", "radio")
                    .attr("id", id)
                    .attr("name", "storage")
                    .attr("value", storageInfo)
                    .addClass("storage-radio");
                const label = $("<label>")
                    .attr("for", id)
                    .text(storageInfo);
                container.append(radio, label);
            }
        });
    
        // Add event listener for storage radios
        $(".storage-radio").on("change", function() {
            selectedStorage = $(this).val();
            filterItems();
        });
    }

    function filterItems() {
        let filteredItems = allItems;

        // Filter by category
        if (selectedCategory !== "all") {
            filteredItems = filteredItems.filter(item => item.Category === selectedCategory);
        }

        // Filter by storage
        if (selectedStorage !== "all") {
            filteredItems = filteredItems.filter(item => item["Storage_Information"] === selectedStorage);
        }

        displayItems(filteredItems);
    }

    // Update category filter event listener
    $(".dropdown-item.category-filter").on("click", function(e) {
        e.preventDefault();
        selectedCategory = $(this).data("category");
        $("#categoryDropdown").text(selectedCategory === "all" ? "Categories" : selectedCategory);
        filterItems();
    });

    // Display items
    function displayItems(items) {
        const container = $("#itemsContainer");
        container.empty();
    
        items.forEach(item => {
            const card = $("<div>").addClass("item-card");
            const icon = getCategoryIcon(item.Category);
            let categoryHtml;
            
            if (typeof icon === 'object' && icon.type === 'png') {
                categoryHtml = `<img src="icons/${icon.name}" alt="${item.Category}" class="custom-icon">`;
            } else {
                categoryHtml = `<i class="fas fa-${icon}"></i>`;
            }
            
            const category = $("<div>").addClass("item-category").html(categoryHtml);
            const image = $("<img>").addClass("item-image").attr("src", getItemImage(item.Photo)).attr("alt", item.Name);
            const name = $("<div>").addClass("item-name").text(item.Name);
            const storage = $("<div>").addClass("item-storage").text(item["Storage_Information"] || item["Storage_Information"]);
            const stock = $("<div>").addClass("item-stock").text(`Stock: ${item.Stock}`);
            
            // Apply red background if stock is at or below the notify threshold
            if (item.NotifyThreshold && parseInt(item.Stock) <= parseInt(item.NotifyThreshold)) {
                stock.addClass("low-stock");
            }
    
            card.append(category, image, name, storage, stock);
            card.on("click", () => showItemDetails(item));
            container.append(card);
        });
    }

    // Get item image (use placeholder if not available)
    function getItemImage(photoUrl) {
        if (photoUrl && photoUrl !== "") {
            if (photoUrl.startsWith('http') || photoUrl.startsWith('/supply_photos/') || photoUrl.startsWith('/')) {
                return photoUrl;
            } else {
                return '/' + photoUrl;
            }
        }
        return "images/noimage.png";
    }

    // Show item details in modal
    function showItemDetails(item) {
        currentItem = item;
        const modal = $("#itemModal");
        const modalBody = modal.find(".modal-body");
        modalBody.empty();

        const content = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${getItemImage(item.Photo)}" alt="${item.Name}" class="img-fluid rounded">
                </div>
                <div class="col-md-6">
                    <h3>${item.Name}</h3>
                    <p><strong>Category:</strong> ${item.Category}</p>
                    <p><strong>Stock:</strong> ${item.Stock}</p>
                    <p><strong>Notify if stock is under:</strong> ${item.NotifyThreshold}</p>
                    <p><strong>Storage Location:</strong> ${item["Storage_Information"]}</p>
                    <p><strong>Purchase Location:</strong> ${item["Purchase_Location"]}</p>
                    <p><strong>Purchase Date:</strong> ${item["Purchase_Date"]}</p>
                    <p><strong>ID:</strong> ${item.ID}</p>
                    ${item.Receipt ? `<p><a href="${item.Receipt}" target="_blank" class="btn btn-primary">View Purchase Receipt</a></p>` : ''}
                </div>
            </div>
        `;

        modalBody.html(content);
        modal.modal("show");
    }

    function getCategoryIcon(category) {
        const icons = {
            "Tools": { type: 'png', name: 'drill.png' },
            "Heavy Duty": "weight-hanging",
            "Storage Containers": "box",
            "Chemicals": "flask",
            "Mining Equipment": { type: 'png', name: 'pickaxe.png' },
            "Lab Equipment": "microscope",
            "Electronics": "bolt",
            "Miscellaneous": "star-of-life"
        };
        return icons[category] || "box";
    }

    $("#registerSupply").on("click", function() {
        $("#registerItemModal").modal("show");
    });

    function generateUniqueId() {
        return 'ID_' + Math.random().toString(36).substr(2, 9);
    }

    $("#searchInput").on("input", function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredItems = allItems.filter(item => 
            item.Name.toLowerCase().includes(searchTerm) ||
            item.Category.toLowerCase().includes(searchTerm) ||
            item.ID.toLowerCase().includes(searchTerm)
        );
        displayItems(filteredItems);
    });

    $("#editItemBtn").on("click", function() {
        if (!currentItem) return;

        const editModal = $("#editItemModal");
        const form = $("#editItemForm");
        form.empty();

        const fields = [
            { name: "Name", type: "text" },
            { name: "Category", type: "select", options: ["Tools", "Heavy Duty", "Storage Containers", "Chemicals", "Mining Equipment", "Lab Equipment", "Electronics", "Miscellaneous"] },
            { name: "Stock", type: "number" },
            { name: "NotifyThreshold", type: "number", label: "Notify if stock is under" },
            { name: "Storage_Information", type: "text", label: "Storage Location" },
            { name: "Purchase_Location", type: "text", label: "Purchase Location" },
            { name: "Purchase_Date", type: "date", label: "Purchase Date" },
            { name: "Photo", type: "file" },
            { name: "Receipt", type: "url" }
        ];

        fields.forEach(field => {
            const formGroup = $("<div>").addClass("form-group");
            const label = $("<label>").attr("for", field.name.toLowerCase().replace("_", "-")).text(field.label || field.name);
            let input;

            switch (field.type) {
                case "select":
                    input = $("<select>").addClass("form-control").attr("id", field.name.toLowerCase().replace("_", "-")).attr("name", field.name);
                    field.options.forEach(option => {
                        const optionElement = $("<option>").val(option).text(option);
                        if (option === currentItem[field.name]) {
                            optionElement.attr("selected", "selected");
                        }
                        input.append(optionElement);
                    });
                    break;
                case "file":
                    input = $("<input>").addClass("form-control").attr("type", "file").attr("id", field.name.toLowerCase()).attr("name", field.name).attr("accept", "image/*");
                    if (currentItem[field.name]) {
                        const preview = $("<img>").attr("src", getItemImage(currentItem[field.name])).addClass("img-thumbnail mt-2").css("max-width", "200px");
                        formGroup.append(preview);
                    }
                    break;
                default:
                    input = $("<input>").addClass("form-control").attr("type", field.type).attr("id", field.name.toLowerCase().replace("_", "-")).attr("name", field.name).val(currentItem[field.name]);
            }

            formGroup.append(label, input);
            form.append(formGroup);
        });

        editModal.modal("show");
    });

    $("#saveNewItemBtn").on("click", function() {
        const form = $("#registerItemForm")[0];
        if (form.checkValidity()) {
            const formData = new FormData(form);
            formData.append("ID", generateUniqueId());
    
            for (let [key, value] of formData.entries()) {
            }
    
            fetch('register-item.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Ensure the new item has all required fields in the correct order
                    const newItem = {};
                    data.debug.headers.forEach((header, index) => {
                        newItem[header] = data.debug.newRow[index];
                    });
                    allItems.push(newItem);
                    updateCSV(() => {
                        loadCSVData();
                        $("#registerItemModal").modal("hide");
                        form.reset();
                    });
                } else {
                    alert('Failed to register item. Please try again. Error: ' + data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again. Error: ' + error.message);
            });
        } else {
            form.reportValidity();
        }
    });
    
    $("#saveEditBtn").on("click", function() {
        const form = $("#editItemForm")[0];
        if (form.checkValidity()) {
            const formData = new FormData(form);
            formData.append("ID", currentItem.ID);
            formData.append("current_photo", currentItem.Photo || '');

            fetch('update-supply.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const updatedItem = data.item;
                    const index = allItems.findIndex(item => item.ID === updatedItem.ID);
                    if (index !== -1) {
                        allItems[index] = updatedItem;
                    }

                    updateCSV(() => {
                        loadCSVData();
                        $("#editItemModal").modal("hide");
                        $("#itemModal").modal("hide");
                    });
                } else {
                    alert('Failed to update item. Please try again. Error: ' + data.error);
                }
            })
            .catch((error) => {
                alert('An error occurred. Please try again. Error: ' + error.message);
            });
        } else {
            form.reportValidity();
        }
    });
    
    function updateCSV(callback) {
        const csvContent = Papa.unparse(allItems);

        fetch('update-supply.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ csvContent }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                if (callback) callback();
            } else {
                alert('Failed to update CSV. Please try again. Error: ' + data.error);
            }
        })
        .catch((error) => {
            alert('An error occurred while updating CSV. Please try again. Error: ' + error.message);
        });
    }

    $("#deleteItemBtn").on("click", function() {
        if (!currentItem) return;

        if (confirm(`Are you sure you want to delete ${currentItem.Name}?`)) {
            const index = allItems.findIndex(item => item.ID === currentItem.ID);
            if (index !== -1) {
                allItems.splice(index, 1);
            }

            updateCSV(() => {
                loadCSVData();
                $("#itemModal").modal("hide");
            });
        }
    });
});

