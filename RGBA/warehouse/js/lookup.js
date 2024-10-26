let isDraggable = false;

$('.action-bar .btn-primary').on('click', function() {
          var createModal = new bootstrap.Modal(document.getElementById('createModal'));
          createModal.show();
      });


$(function() {
$(document).ready(function() {
  function loadLookupTypes() {
  $.ajax({
      url: '/RGBA/warehouse/php/lookup_types.php',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
          var tbody = $('#table-list tbody');
          tbody.empty();
          if (response.success && Array.isArray(response.data)) {
              response.data.forEach(function(lookupType) {
                  var row = $('<tr></tr>');
                  var td = $('<td data-id="' + lookupType.id + '">' + lookupType.name + '</td>');
                  var deleteBtn = $('<button class="delete-btn">&#10005;</button>');
                  deleteBtn.on('click', function(event) {
                      event.stopPropagation();
                      deleteLookupType(lookupType.id);
                  });
                  
                  td.append(deleteBtn);
                  row.append(td);
                  tbody.append(row);
              });
          } else {
              console.error('Invalid data format in response:', response);
          }
      },
      error: function(xhr, status, error) {
          console.error('Error loading lookup types:', status, error);
      }
  });
}

function deleteLookupType(lookupTypeId) {
  if(confirm('Are you sure you want to delete this lookup type?')) {
      $.ajax({
          url: '/RGBA/warehouse/php/lookup_types.php',
          method: 'POST',
          data: { id: lookupTypeId, action: 'deleteLookupType' },
          dataType: 'json',
          success: function(response) {
              if (response.success) {
                  loadLookupTypes();
              } else {
                  alert('Failed to delete lookup type: ' + response.message);
              }
          },
          error: function(xhr, status, error) {
              console.error('Error deleting lookup type:', status, error);
              alert('Error deleting lookup type. Please try again.');
          }
      });
  }
}



  
  $('.form-information').submit(function(event) {
      event.preventDefault();
      var lookupTypeName = $('#lookuptype').val();
      $.ajax({
          url: '/RGBA/warehouse/php/lookup_types.php',
          method: 'POST',
          data: { lookuptype: lookupTypeName },
          dataType: 'json',
          success: function(response) {
              if (response.success) {
                  loadLookupTypes();
                  $('#myModal').modal('hide');
                  $('#lookuptype').val('');
              } else {
                  alert(response.message); 
              }
          },
          error: function(xhr, status, error) {
              console.error('Error adding lookup type:', status, error);
              alert('Error adding lookup type. Please try again.');
          }
      });
  });
  
  loadLookupTypes();


      
  function loadSubElements(lookupTypeId) {
return new Promise((resolve, reject) => {
  $.ajax({
      url: '/RGBA/warehouse/php/lookup_types.php?lookupTypeId=' + lookupTypeId,
      method: 'GET',
      dataType: 'json',
      success: function(response) {
          if (response.success && Array.isArray(response.data)) {
              var subElementsContainer = $('#subElementsContainer');
              subElementsContainer.empty();
              if (response.data.length === 0) {
                  subElementsContainer.html('<p>No sub-elements found.</p>');
              } else {
                  response.data.forEach(function(subElement) {
                      var subElementDiv = $('<div class="sub-element" data-id="' + subElement.id + '"></div>');
                      var dragIcon = $('<i class="fas fa-grip-vertical drag-icon"></i>');
                      var subElementName = $('<span class="sub-element-name">' + subElement.name + '</span>');
                      var deleteButton = $('<button class="delete-btn">&#10005;</button>');
                      deleteButton.on('click', function(e) {
                          e.stopPropagation();
                          deleteSubElement(lookupTypeId, subElement.id);
                      });
                      
                      subElementDiv.append(dragIcon, subElementName, deleteButton);
                      subElementsContainer.append(subElementDiv);
                  });
              }
              initSortable();
              updateDraggableState();
              resolve();
          } else {
              console.error('Failed to load sub-elements:', response.message);
              $('#subElementsContainer').html('<p>Error: ' + (response.message || 'Failed to load sub-elements') + '</p>');
              reject('Failed to load sub-elements: ' + (response.message || 'Unknown error'));
          }
      },
      error: function(xhr, status, error) {
          console.error('Error loading sub-elements:', status, error);
          $('#subElementsContainer').html('<p>Error loading sub-elements. Please try again.</p>');
          reject('Error loading sub-elements: ' + error);
      }
  });
});
}

function updateDraggableState() {
  if (isDraggable) {
      $('#subElementsContainer').addClass('draggable');
      $('.sub-element').addClass('draggable-item');
      $('.drag-icon').show();
  } else {
      $('#subElementsContainer').removeClass('draggable');
      $('.sub-element').removeClass('draggable-item');
      $('.drag-icon').hide();
  }
}

function initSortable() {
$('#subElementsContainer').sortable({
  disabled: !isDraggable,
  axis: 'y',
  cursor: 'move',
  stop: function(event, ui) {
      if (isDraggable) {
          saveNewOrder();
      }
  }
});
}


function saveNewOrder() {
var lookupTypeId = $('#subElementsModal').data('lookupTypeId');
var newOrder = $('#subElementsContainer .sub-element').map(function() {
  return {
      id: String($(this).data('id')), // Explicitly convert to string
      name: $(this).find('.sub-element-name').text()
  };
}).get();

$.ajax({
  url: '/RGBA/warehouse/php/lookup_types.php',
  method: 'POST',
  data: {
      action: 'updateSubElementOrder',
      lookupTypeId: String(lookupTypeId), // Explicitly convert to string
      newOrder: JSON.stringify(newOrder)
  },
  dataType: 'json',
  success: function(response) {
      if (response.success) {
          loadSubElements(lookupTypeId);
      } else {
          console.error('Failed to update sub-element order:', response.message);
      }
  },
  error: function(xhr, status, error) {
      console.error('Error updating sub-element order:', status, error);
  }
});
}

$('#toggleDragBtn').on('click', function() {
  isDraggable = !isDraggable;
  $('#subElementsContainer').sortable('option', 'disabled', !isDraggable);
  $(this).text(isDraggable ? 'Disable Drag' : 'Enable Drag');
  updateDraggableState();
});

$('#table-list').on('click', 'tbody tr', function() {
var lookupTypeId = $(this).find('td').data('id');
var modal = new bootstrap.Modal(document.getElementById('subElementsModal'));
modal.show();

$('#subElementsModal').off('shown.bs.modal').on('shown.bs.modal', function () {
  loadSubElements(lookupTypeId).then(() => {
      $('#subElementsModal').data('lookupTypeId', lookupTypeId);
      $('#addSubElementBtn').off('click').on('click', function() {
          var subElementName = $('#subElementInput').val();
          if (subElementName) {
              addSubElement(lookupTypeId, subElementName);
          }
      });
  }).catch(error => {
      console.error('Error loading sub-elements:', error);
      $('#subElementsContainer').html('<p>Error: ' + error + '</p>');
  });
});
});
          
          $('#subElementInput').keypress(function(event) {
              if (event.which == 13) {
                  event.preventDefault();
                  $('#addSubElementBtn').click();
              }
          });
          
          
function addSubElement(lookupTypeId, subElementName) {
$.ajax({
  url: '/RGBA/warehouse/php/lookup_types.php',
  method: 'POST',
  data: { lookupTypeId: lookupTypeId, subElementName: subElementName },
  dataType: 'json',
  success: function(response) {
      if (response.success) {
          $('#subElementInput').val('');
          loadSubElements(lookupTypeId);
      } else {
          alert(response.message);
      }
  },
  error: function(xhr, status, error) {
      console.error('Error adding sub-element:', status, error);
      alert('Error adding sub-element. Please try again.');
  }
});
}

function deleteSubElement(lookupTypeId, subElementId) {
$.ajax({
  url: '/RGBA/warehouse/php/lookup_types.php',
  method: 'POST',
  data: { action: 'deleteSubElement', lookupTypeId: lookupTypeId, subElementId: subElementId },
  dataType: 'json',
  success: function(response) {
      if (response.success) {
          loadSubElements(lookupTypeId);
      } else {
          alert('Failed to delete sub-element: ' + response.message);
      }
  },
  error: function(xhr, status, error) {
      console.error('Error deleting sub-element:', status, error);
      alert('Error deleting sub-element. Please try again.');
  }
});
}

      });
  });	