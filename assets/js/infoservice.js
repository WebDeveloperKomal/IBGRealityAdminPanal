// ---------------------------- save the data ----------------------------------------


function saveData() {
    var formData = new FormData(document.getElementById('myForm'));

    var jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    var data = {
        name: formData.get('name'),
        text: CKEDITOR.instances.editor2.getData(), // Get data from CKEditor instance 1
        home_text: CKEDITOR.instances.editor3.getData() // Get data from CKEditor instance 2
    };

    // Convert the data object to JSON and append it to the formData object
    formData.append('data', JSON.stringify(data));

    // Append image files to formData
    formData.append('image1File', formData.get('image1'));
    formData.append('image2File', formData.get('image2'));

    fetch('http://localhost:8181/Gardener/auth/save-services', {
        method: 'POST',
        body: formData,
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
            console.log('Server response:', data);
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Services have been saved successfully.',
            }).then((result) => {
                window.location.href = 'infoservice.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save services. Please try again.',
            });
        });
}


// --------------------------get all the data-----------------------------------------------

var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/Gardener/auth/get-all-services', {
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
            populateTable(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
                <td style="color: #0F4229;"><img src="data:image/jpeg;base64,${item.image1}" width="100" height="100"></td>
                <td style="color: #0F4229;"><img src="data:image/jpeg;base64,${item.image2}" width="100" height="100"></td>
                <td style="color: #0F4229;">
                <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i> Edit</a>
                <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i> Delete</a>
                </td>
            `;
            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);

                fetch(`http://localhost:8181/Gardener/auth/get-services/${id}`, {
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
                        localStorage.setItem('updateData', JSON.stringify(data.data));
                        console.log(localStorage.getItem('updateData')); // Add this line
                        window.location.href = 'update-infoservice-form.html';
                    })
                    .catch(error => {
                        console.error('Error fetching service data:', error);
                    });
            });


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



// ----------------------------------------delete by id-----------------------------------------------

function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/delete-services/${id}`, {
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

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Service has been deleted successfully.',
            }).then((result) => {

                getData();
            });
        })
        .catch(error => {
            console.error('Error deleting service:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the service. Please try again later.',
            });
        });
}

// -----------------------------------update the data by id-------------------------------------------


function updateData() {
    var formData = new FormData(document.getElementById('myForm'));
    var jwtToken = localStorage.getItem('jwtToken');
    var id = formData.get('id');

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    // Construct the data object from form fields
    var data = {
        name: formData.get('name'),
        text: CKEDITOR.instances.editor2.getData(),
        home_text: CKEDITOR.instances.editor3.getData(),
        // Add other fields as needed
    };

    // Convert the data object to a JSON string and append it to FormData
    formData.append('data', JSON.stringify(data));

    // Add image files to FormData if they exist
    if (formData.get('image1')) {
        formData.append('image1File', formData.get('image1'));
    }
    if (formData.get('image2')) {
        formData.append('image2File', formData.get('image2'));
    }

    // Configure the fetch request
    var url = 'http://localhost:8181/Gardener/auth/update-services/' + id;
    var options = {
        method: 'PUT',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        }
    };

    // Send the fetch request
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Services have been updated successfully.'
            }).then((result) => {
                window.location.href = 'infoservice.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update services. Please try again.'
            });
        });
}
