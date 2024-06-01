// -----------------------------get all the data-----------------------------------------------------------

var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/Gardener/auth/get-all-home-about', {
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
                <td style="color: #0F4229;">${item.about}</td>
                <td style="color: #0F4229;">${item.about_title}</td>
                <td style="color: #0F4229;">${item.about_text}</td>
                <td style="color: #0F4229;"><img src="data:image/jpeg;base64,${item.image_a}" width="100" height="100"></td>
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

                fetch(`http://localhost:8181/Gardener/auth/get-home-about/${id}`, {
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
                        window.location.href = 'Update-home-about-content.html';

                    })
                    .catch(error => {
                        console.error('Error fetching home about content data:', error);
                    });

            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteAboutContent(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}

// -----------------------------delete the data by id-----------------------------------------------------------

function deleteAboutContent(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/delete-home-about/${id}`, {
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
                text: 'home about content has been deleted successfully.',
            }).then((result) => {

                getData();
            });
        })

        .catch(error => {
            console.error('Error home about content home about content:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the home about content. Please try again later.',
            });
        });
}

// --------------------------update data by id--------------------------------------------------

function updateData() {
    var id = document.getElementById('id').value;
    var about = document.getElementById('about').value;
    var about_title = document.getElementById('about_title').value;
    var about_text = document.getElementById('about_text').value;
    var imageFile = document.getElementById('image-input').files[0];
    var jwtToken = localStorage.getItem('jwtToken');

    if (!about || !about_title || !about_text) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    var formData = new FormData();
    formData.append('about_title', about_title);
    formData.append('about_text', about_text);
    formData.append('about', about);
    formData.append('id', id); // Add ID to the form data

    var jsonData = {
        about_title: about_title,
        about_text: about_text,
        about: about
    };

    formData.append('data', JSON.stringify(jsonData));

    if (imageFile) {
        formData.append('imageFile', imageFile);
    }

    fetch(`http://localhost:8181/Gardener/auth/update-home-about/${id}`, {
        method: 'PUT',
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
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Data has been updated successfully.',
                }).then((result) => {
                    window.location.href = 'Home-about-us-content.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update data. ' + data.error,
                });
            }
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
