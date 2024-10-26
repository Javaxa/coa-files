let isEmployeeView = false;
let userData = [];
let isInitialized = false;
let refreshInterval;

$(document).ready(function() {
    fetchUserData();

if (!isInitialized) {
    init();
    isInitialized = true;
}

// Add event listener for page visibility changes
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
    }
});

    $.ajax({
        url: '/RGBA/warehouse/json/user_data.json',
        dataType: 'json',
        success: function(data) {
            userData = data;
            if (!isInitialized) {
                init();
                isInitialized = true;
            }
        },
        error: function() {
            alert("Error loading user data.");
        }
    });

    $('#NodesContainer').on('click', '.node-container', function(event) {
        event.stopPropagation();
        var departmentName = $(this).children('.node').text();

        var filteredUsers = userData.filter(function(user) {
            return user.department === departmentName;
        });

        if (filteredUsers.length === 0) {
            alert('No user was found under the position: ' + departmentName);
            return;
        }

        var modalContent = '<h2>' + departmentName + '</h2><ul>';
        filteredUsers.forEach(function(user) {
            modalContent += '<li>' +
                            '<span class="user-name">' + user.firstname + ' ' + user.lastname + '</span>' +
                            '<span class="user-phone">Phone: ' + user.phone + '</span>' +
                            '<span class="user-email">Email: ' + user.email + '</span>' +
                            '</li>';
        });
        modalContent += '</ul>';
        $('#modalContent').html(modalContent);
        $('#modalBackdrop').show();
    });

    $('#modalBackdrop').click(function(event) {
        if (event.target.id === 'modalBackdrop') {
            $(this).hide();
        }
    });

    $('#userModal').click(function(event) {
        event.stopPropagation();
    });

    $('#closeModal').click(function() {
        $('#modalBackdrop').hide();
    });

    $('#NodesContainer').on('mouseenter', '.node-container', function() {
        $(this).children('.node').css('background', '#163e77');
    }).on('mouseleave', '.node-container', function() {
        $(this).children('.node').css('background', '');
    });
});

var nodes, 
nodesContainer, 
gState = {
    curDragEl: null,
    nodesById: {},
    nodeElsById: {}
};

function init() {
    nodesContainer = document.querySelector('#NodesContainer');
    fetchNodes();
    setupToggleButton();
    startAutoRefresh();
}

function startAutoRefresh() {
    // Fetch data immediately
    fetchData();
    // Then set up interval to fetch data every 30 seconds
    refreshInterval = setInterval(fetchData, 30000);
}

function stopAutoRefresh() {
    clearInterval(refreshInterval);
}

function fetchData() {
    fetchNodes();
    fetchUserData();
}

function setupToggleButton() {
    const toggleButton = document.getElementById('toggleView');
    toggleButton.addEventListener('click', function() {
        isEmployeeView = !isEmployeeView;
        this.textContent = isEmployeeView ? 'Return to Default View' : 'Employee View';
        rerender();
    });
}

function fetchNodes() {
    var nocache = new Date().getTime();
    $.ajax({
        url: 'json/departments.json',
        dataType: 'json',
        cache: false,
        data: { nocache: nocache },
        success: function(data) {
            nodes = data.departments.map(function(dept) {
                return {
                    id: parseInt(dept.id, 10),
                    parent: dept.parent ? parseInt(dept.parent, 10) : null,
                    name: dept.name
                };
            });
            render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch nodes:', textStatus, errorThrown);
        }
    });
}

function fetchUserData() {
    $.ajax({
        url: 'json/user_data.json',
        dataType: 'json',
        cache: false,
        success: function(data) {
            userData = data;
            if (isEmployeeView) {
                render(); // Re-render if in employee view to update employee lists
            }
        },
        error: function() {
            console.error("Error loading user data.");
        }
    });
}

function updateParent(nodeId, parentId) {
    $.ajax({
        url: '/RGBA/warehouse/php/update-parent.php', 
        type: 'POST',
        data: { nodeId: nodeId, parentId: parentId },
        success: function(response) {
            console.log('Update successful', response);
        },
        error: function(xhr, status, error) {
            console.error('Update failed', status, error);
        }
    });
}

function render() {
    gState.nodesById = {};
    gState.nodeElsById = {};
    nodesContainer.innerHTML = '';

    for (var i = 0; i < nodes.length; i++) {
        gState.nodesById[nodes[i].id] = nodes[i];
        var nodeEl = createNode(nodes[i]);
        gState.nodeElsById[nodes[i].id] = nodeEl;
    }

    for (i = 0; i < nodes.length; i++) {
        if(!nodes[i].parent) {
            nodesContainer.appendChild(gState.nodeElsById[nodes[i].id]);            
        } else {
            gState.nodeElsById[nodes[i].parent].appendChild(gState.nodeElsById[nodes[i].id]);
        }
    }
}

function rerender() {
    render();
}

function createNode(data) {
    var nodeContainer = document.createElement('div');
    nodeContainer.className = 'node-container';
    if(data.parent) {
        nodeContainer.classList.add('has-parent');        
    }

    var node = document.createElement('div');
    nodeContainer.appendChild(node);
    nodeContainer.id = data.id;
    node.classList.add('node');

    var text = document.createTextNode(data.name);
    node.appendChild(text);

    if (isEmployeeView) {
        const employeeList = createEmployeeList(data.name);
        if (employeeList) {
            nodeContainer.appendChild(employeeList);
        }
    }

    makeNodeMovable(nodeContainer, data);
    makeNodeDroppable(nodeContainer, data);
    return nodeContainer;
}

function createEmployeeList(departmentName) {
    const filteredUsers = userData.filter(user => user.department === departmentName);
    
    if (filteredUsers.length === 0) {
        return null;
    }

    const employeeList = document.createElement('div');
    employeeList.className = 'employee-list';

    const ul = document.createElement('ul');
    filteredUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.firstname} ${user.lastname}`;
        ul.appendChild(li);
    });
    employeeList.appendChild(ul);

    return employeeList;
}

function makeNodeMovable(node, data) {
    var originalParentId = data.parent; 

    node.draggable = true;
    node.ondragstart = function(e) {
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        node.classList.add('dragging');
        gState.curDragEl = node;
    };

    node.ondragend = function(e) {
        e.stopPropagation();
        if (!gState.dropSuccess) {
            gState.nodesById[data.id].parent = null; 
            updateParent(data.id, null); 
            rerender(); 
        }
        gState.dropSuccess = false; 
        node.classList.remove('dragging');
        gState.curDragEl = null;
    };
}

function makeNodeDroppable(node, data) {
    node.ondrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        gState.dropSuccess = true;

        if (gState.curDragEl.id != e.target.id && !gState.curDragEl.querySelector('[id="'+e.target.id+'"]')) {
            gState.nodesById[gState.curDragEl.id].parent = parseInt(e.target.id, 10); 
            updateParent(gState.curDragEl.id, e.target.id);
            rerender(); 
        }
        node.classList.remove('adding-node');
        gState.curDragEl.classList.remove('dragging');
    };

    node.ondragover = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(e.target.id != gState.curDragEl.id) {
            node.classList.add('adding-node');
        }
    };

    node.ondragleave = function(e) {
        e.preventDefault();
        e.stopPropagation();
        node.classList.remove('adding-node');
    };
}