

function saveData() {
    var formData = new FormData();
    var data = {
        applicant_name: document.querySelector('#name').value,
        appli_email: document.querySelector('#email').value,
        address: document.querySelector('#address').value,
        dob: document.querySelector('#dob').value,
        appli_education: document.querySelector('#education').value,
        description: CKEDITOR.instances['editor2'].getData(),
        applied_for: document.querySelector('#position').value,
        phone_number: document.querySelector('#phone_number').value
    };

    formData.append('data', JSON.stringify(data));

    var resumeFile = document.querySelector('input[name="resume"]').files[0];
    if (resumeFile) {
        formData.append('uploadResume', resumeFile);
    }

    var coverLetterFile = document.querySelector('input[name="covr_letter"]').files[0];
    if (coverLetterFile) {
        formData.append('uploadCovr_letter', coverLetterFile);
    }

    // Fetch JWT token from localStorage
    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', formData);

    fetch('http://localhost:8181/Gardener/auth/save-career-form', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + jwtToken // Include JWT token in the headers
        }
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
                text: 'Data has been saved successfully.',
            }).then((result) => {
                window.location.href = 'career.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            });
        });
}



var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/Gardener/auth/get-all-career-forms', {
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


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Update the populateTable function to include data for name, title, description, and image
function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            // Extract year, month, and day from dob
            const dob = new Date(item.dob);
            const year = dob.getFullYear();
            const month = padZero(dob.getMonth() + 1); // Months are zero-based, so add 1
            const day = padZero(dob.getDate());
            row.innerHTML = `
                <td style="color: #0F4229;">${index + 1}</td>
                <td style="color: #0F4229;">${item.name}</td>
                <td style="color: #0F4229;">${item.email}</td>
                <td style="color: #0F4229;">${item.address}</td>
                <td style="color: #0F4229;">${item.education}</td>
                <td style="color: #0F4229;">${item.phone_number}</td>
                <td style="color: #0F4229;">${year}-${month}-${day}</td>
                <td style="color: #0F4229;">${item.resumes}</td>
                <td style="color: #0F4229;">${item.coverletter}</td>
                <td style="color: #0F4229;">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);
                // Fetch data for the selected item
                fetch(`http://localhost:8181/Gardener/auth/get-career-form/${id}`, {
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
                        // Store fetched data in local storage
                        localStorage.setItem('updateData', JSON.stringify(data.data));

                        // Redirect to update-services.html
                        window.location.href = 'update-career.html';
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

// Function to pad single digits with leading zeros
function padZero(num) {
    return num < 10 ? '0' + num : num;
}


// ----------------------------------------delete by id-----------------------------------------------

function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/delete-career-form/${id}`, {
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

// -----------------------------------update the data by id-------------------------------------------


function updateData() {
    var formData = new FormData();
    var id = document.querySelector('#id').value; // Extract ID from the form

    var data = {
        applicant_name: document.querySelector('#name').value,
        appli_email: document.querySelector('#email').value,
        address: document.querySelector('#address').value,
        dob: document.querySelector('#dob').value,
        appli_education: document.querySelector('#education').value,
        description: CKEDITOR.instances['editor2'].getData(),
        applied_for: document.querySelector('#position').value,
        phone_number: document.querySelector('#phone_number').value
    };

    formData.append('data', JSON.stringify(data));

    var resumeFile = document.querySelector('input[name="resume"]').files[0];
    if (resumeFile) {
        formData.append('uploadResume', resumeFile);
    }

    var coverLetterFile = document.querySelector('input[name="covr_letter"]').files[0];
    if (coverLetterFile) {
        formData.append('uploadCovr_letter', coverLetterFile);
    }

    // Fetch JWT token from localStorage
    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', formData);

    fetch('http://localhost:8181/Gardener/auth/update-career-form/' + id, {
        method: 'PUT',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + jwtToken, // Include JWT token in the headers
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
                title: 'Updated!',
                text: 'Data has been updated successfully.',
            }).then((result) => {
                window.location.href = 'career.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update data. Please try again.',
            });
        });
}
