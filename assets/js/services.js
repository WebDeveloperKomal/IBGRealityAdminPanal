var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/Gardener/auth/get-all-services-content', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            populateTable(data.data); // Assuming your data object has a 'data' property containing the array
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: #0F4229;">${index + 1}</td>
                <td style="color: #0F4229;">${item.name}</td>
                <td style="color: #0F4229;">${item.title}</td>
                <td style="color: #0F4229;">${item.information}</td>
                <td style="color: #0F4229;">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Add event listener to edit button
            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);
                // Redirect to update-service.html and pass data as query parameters
                fetch(`http://localhost:8181/Gardener/auth/get-services-content/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + jwtToken,
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Redirect to update-services.html and pass data as query parameters
                        window.location.href = `update-services.html?id=${id}&name=${data.data.name}&title=${data.data.title}&information=${data.data.information}`;
                    })
                    .catch(error => {
                        console.error('Error fetching service data:', error);
                    });
            });

            // Add event listener to delete button
            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteService(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/delete-services-content/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Show SweetAlert upon successful deletion
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Service has been deleted successfully.',
            }).then((result) => {
                // Reload the data or update the UI as needed
                // For example, you can remove the deleted row from the table
                getData(); // Reload the data after deletion
            });
        })
        .catch(error => {
            console.error('Error deleting service:', error);
            // Show SweetAlert for error
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the service. Please try again later.',
            });
        });
}

function updateData() {
    // Retrieve the values from the form fields
    const updatedName = document.getElementById('name').value;
    const updatedTitle = document.getElementById('title').value;
    const updatedInformation = document.getElementById('information').value;

    // Call the updateService function with the retrieved values
    updateService(id, updatedName, updatedTitle, updatedInformation);
}


function updateService(id, name, title, information) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/update-services-content/${id}?name=${name}&title=${title}&information=${information}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Show SweetAlert upon successful update
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Service has been updated successfully.',
            }).then((result) => {
                // Reload the data or update the UI as needed
                // For example, you can update the row in the table
                window.location.href = 'Services.html';
                getData(); // Reload the data after update
            });
        })
        .catch(error => {
            console.error('Error updating service:', error);
            // Show SweetAlert for error
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update the service. Please try again later.',
            });
        });
}
