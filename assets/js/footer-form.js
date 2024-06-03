document.addEventListener('DOMContentLoaded', function () {
    // On page load, fetch data and populate the table
    getData();
});

function getData() {
    fetch('http://localhost:8080/auth/get-all-footer-Contact')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to fetch data. Please try again later.',
            });
        });
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.address}</td>
            <td>${item.number}</td>
            <td>${item.email}</td>
            <td>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);

        // Add event listener for delete button inside the loop
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const id = deleteBtn.getAttribute('data-id');
            console.log("Delete button clicked for ID: " + id);

            // Show SweetAlert confirmation dialog when delete button is clicked
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // If user confirms deletion, perform delete operation
                    fetch(`http://localhost:8080/auth/delete-footer-Contact/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete contact');
                        }
                        console.log("Contact deleted successfully");
                        // If deletion is successful, show success alert and reload the data
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'The contact has been deleted.',
                        });
                        getData();
                    })
                    .catch(error => {
                        console.error('Error deleting contact:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to delete contact. Please try again later.',
                        });
                    });
                }
            });
        });
    });
}



// function saveData() {
//     var formData = new FormData();
//     formData.append('pingNow', document.getElementById('ping_now').value);
//     formData.append('text', document.getElementById('text').value);
//     formData.append('openHours', document.getElementById('open_hours').value);
//     formData.append('footer_title', document.getElementById('footer_title').value);

//     var imageFile = document.getElementById('image-input').files[0];
//     if (imageFile) {
//         formData.append('image', imageFile);
//     }

//     // Your JWT token retrieval logic here
//     var jwtToken = localStorage.getItem('jwtToken');

//     if (!formData.get('pingNow')) {
//         alert('Please fill in the Ping Now field.');
//         return;
//     }

//     if (!jwtToken) {
//         alert('JWT token is missing. Please log in again.');
//         return;
//     }

//     fetch('http://localhost:8181/Gardener/auth/save-footer', {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'Authorization': 'Bearer ' + jwtToken,
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(text);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Server response:', data);
//             if (data.status) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Saved!',
//                     text: 'Footer data has been saved successfully.',
//                 }).then((result) => {
//                     window.location.href = 'Footer.html';
//                 });
//             } else {
//                 throw new Error(data.error || 'Unknown error occurred.');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Failed to save footer data. Please try again.',
//             });
//         });
// }



// var jwtToken = localStorage.getItem('jwtToken');

// document.addEventListener('DOMContentLoaded', getData);


// function getData() {
//     var jwtToken = localStorage.getItem('jwtToken');

//     fetch('http://localhost:2222/auth-al/get-details', {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer ' + jwtToken,
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             populateTable(data.data); // Assuming your data object has a 'data' property containing the array
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// }


// function arrayBufferToBase64(buffer) {
//     let binary = '';
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
// }


// Update the populateTable function to include data for name, title, description, and image
// function populateTable(data) {
//     const tableBody = document.getElementById('dataTableBody');
//     tableBody.innerHTML = '';

//     if (Array.isArray(data)) {
//         data.forEach((item, index) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td style="color: #0F4229;">${index + 1}</td>
//                 <td style="color: #0F4229;">${item.name}</td>
//                 <td style="color: #0F4229;"><img src="data:image/jpeg;base64,${item.image}" width="100" height="100"></td>
//                 <td style="color: #0F4229;">
//                     <button class="edit-btn" data-id="${item.id}">Edit</button>
//                     <button class="delete-btn" data-id="${item.id}">Delete</button>
//                 </td>
//             `;
//             tableBody.appendChild(row);

//             const editBtn = row.querySelector('.edit-btn');
//             editBtn.addEventListener('click', function () {
//                 const id = editBtn.getAttribute('data-id');
//                 console.log("Edit button clicked for ID: " + id);
//                 // Fetch data for the selected item
//                 fetch(`http://localhost:8181/Gardener/auth/get-home-footer/${id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': 'Bearer ' + jwtToken,
//                     },
//                 })
//                     .then(response => {
//                         if (!response.ok) {
//                             throw new Error('Network response was not ok');
//                         }
//                         return response.json();
//                     })
//                     .then(data => {
//                         // Store fetched data in local storage
//                         localStorage.setItem('updateData', JSON.stringify(data));

//                         // Redirect to update-services.html
//                         window.location.href = 'Update-footer.html';
//                     })
//                     .catch(error => {
//                         console.error('Error fetching service data:', error);
//                     });
//             });

//             // Add event listener to delete button
//             const deleteBtn = row.querySelector('.delete-btn');
//             deleteBtn.addEventListener('click', () => {
//                 const id = deleteBtn.getAttribute('data-id');
//                 deleteService(id);
//             });
//         });
//     } else {
//         console.error('Data received is not an array:', data);
//     }
// }


// ----------------------------------------delete by id-----------------------------------------------

// function deleteService(id) {
//     var jwtToken = localStorage.getItem('jwtToken');

//     fetch(`http://localhost:8181/Gardener/auth/delete-footer/${id}`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': 'Bearer ' + jwtToken,
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             // Show SweetAlert upon successful deletion
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: 'Service has been deleted successfully.',
//             }).then((result) => {
//                 // Reload the data or update the UI as needed
//                 // For example, you can remove the deleted row from the table
//                 getData(); // Reload the data after deletion
//             });
//         })
//         .catch(error => {
//             console.error('Error deleting service:', error);
//             // Show SweetAlert for error
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Failed to delete the service. Please try again later.',
//             });
//         });
// }

// -----------------------------------update the data by id-------------------------------------------


// function updateData() {
//     var id = document.getElementById('id').value; // Fetch the ID from the form
//     var ping_now = document.getElementById('ping_now').value;
//     var text = document.getElementById('text').value;
//     var open_hours = document.getElementById('open_hours').value;
//     var footer_title = document.getElementById('footer_title').value;
//     var imageFile = document.getElementById('image-input').files[0];
//     var jwtToken = localStorage.getItem('jwtToken');

//     // Validate if the required fields are filled
//     if (!ping_now || !text || !open_hours || !footer_title) {
//         alert('Please fill in all required fields.');
//         return;
//     }

//     // Validate JWT token
//     if (!jwtToken) {
//         alert('JWT token is missing. Please log in again.');
//         return;
//     }

//     // Prepare form data for submission
//     var formData = new FormData();
//     formData.append('ping_now', ping_now); // Ensure 'ping_now' is included
//     formData.append('text', text);
//     formData.append('open_hours', open_hours); // Make sure parameter names match server-side
//     formData.append('footer_title', footer_title);
//     if (imageFile) {
//         formData.append('image', imageFile);
//     }

//     // Send the update request to the server
//     fetch(`http://localhost:8181/Gardener/auth/update-home-footer/${id}`, {
//         method: 'PUT',
//         body: formData,
//         headers: {
//             'Authorization': 'Bearer ' + jwtToken,
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Server response:', data);
//             if (data.status) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Updated!',
//                     text: 'Data has been updated successfully.',
//                 }).then((result) => {
//                     // Optionally redirect or perform other actions upon successful update
//                     window.location.href = 'Footer.html';
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error!',
//                     text: 'Failed to update data. ' + data.error,
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Failed to update data. Please try again.',
//             });
//         });
// }
