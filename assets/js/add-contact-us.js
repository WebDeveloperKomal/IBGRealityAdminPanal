document.addEventListener('DOMContentLoaded', function () {
    // On page load, fetch data and populate the table
    getData();
});

function getData() {
    fetch('http://localhost:8080/auth/get-all-contact-list')
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
        });
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.services}</td>
            <td>${item.message}</td>
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
                    fetch(`http://localhost:8080/auth/delete-contact/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete contact');
                        }
                        console.log("Contact deleted successfully");
                        // If deletion is successful, reload the data
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


// ------------------------------get all the data--------------------------------------

// document.addEventListener('DOMContentLoaded', function () {
//     getData();
// });

// function getData() {
//     fetch('http://localhost:2222/auth/get-all-contact')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             populateTable(data); // Pass the received data directly to populateTable
//         })
//         .catch(error => {
//             console.error('Error fetching or processing data:', error);
//         });
// }

// function populateTable(data) {
//     const tableBody = document.getElementById('dataTableBody');
//     tableBody.innerHTML = '';

//     data.forEach((item, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td style="color: #0F4229;">${index + 1}</td>
//             <td style="color: #0F4229;">${item.id}</td>
//             <td style="color: #0F4229;">${item.name}</td>
//             <td style="color: #0F4229;">${item.email}</td>
//             <td style="color: #0F4229;">${item.phone}</td>
//             <td style="color: #0F4229;">${item.services}</td>
//             <td style="color: #0F4229;">${item.message}</td>
//             <td style="color: #0F4229;">
//                 <a class="edit-btn" data-id="${item.id}">
//                 <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
//             </td>
//         `;
//         tableBody.appendChild(row);

//         const editBtn = row.querySelector('.edit-btn');
//         editBtn.addEventListener('click', function () {
//             const id = editBtn.getAttribute('data-id');
//             console.log("Edit button clicked for ID: " + id);
//             // Handle edit functionality
//         });

//         const deleteBtn = row.querySelector('.delete-btn');
//         deleteBtn.addEventListener('click', () => {
//             const id = deleteBtn.getAttribute('data-id');
//             console.log("Delete button clicked for ID: " + id);
//             // Handle delete functionality
//         });
//     });
// }


// deleteBtn.addEventListener('click', () => {
//     const id = deleteBtn.getAttribute('data-id');
//     console.log("Delete button clicked for ID: " + id);
    
//     fetch(`http://localhost:2222/auth/delete-contact-us/${id}`, {
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to delete contact');
//         }
//         // If deletion is successful, reload the data
//         getData();
//     })
//     .catch(error => {
//         console.error('Error deleting contact:', error);
//         alert('Failed to delete contact. Please try again later.'); // Add an alert message
//     });
// });




// ----------------------------save the data------------------------------------

// function saveData() {
//     var saveData = {
//         address: document.getElementById('address').value,
//         phone: document.getElementById('phone').value,
//         email: document.getElementById('email').value,
//         map: document.getElementById('map').value
//     };


//     var jwtToken = localStorage.getItem('jwtToken');

//     console.log('Request Data:', JSON.stringify(saveData));

//     if (!saveData.address || !saveData.phone || !saveData.email) {
//         alert('Please fill in all required fields.');
//         return;
//     }

//     if (!jwtToken) {
//         alert('JWT token is missing. Please log in again.');
//         return;
//     }
    
//     fetch('http://localhost:8181/Gardener/auth/save-contact-us', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + jwtToken,
//         },
//         body: JSON.stringify(saveData)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Server response:', data);

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Saved!',
//                 text: 'Data has been saved successfully.',
//             }).then((result) => {

//                 document.getElementById('address').value = '';
//                 document.getElementById('phone').value = '';
//                 document.getElementById('email').value = '';
//                 document.getElementById('map').value = '';
//                 window.location.href = 'Contact-Us.html';

//             });
//         })
//         .catch(error => {
//             console.error('Error:', error);

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Failed to save data. Please try again.',
//             });
//         });
// }


// // ------------------------------get all the data--------------------------------------

// var jwtToken = localStorage.getItem('jwtToken');

// document.addEventListener('DOMContentLoaded', getData);


// function getData() {
//     var jwtToken = localStorage.getItem('jwtToken');

//     fetch('http://localhost:8181/Gardener/auth/get-all-contact-us', {
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
//             populateTable(data.data);
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



// function populateTable(data) {
//     const tableBody = document.getElementById('dataTableBody');
//     tableBody.innerHTML = '';

//     if (Array.isArray(data)) {
//         data.forEach((item, index) => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td style="color: #0F4229;">${index + 1}</td>
//                 <td style="color: #0F4229;">${item.name}</td>
//                 <td style="color: #0F4229;">${item.email}</td>
//                 <td style="color: #0F4229;">${item.phone}</td>
//                 <td style="color: #0F4229;">${item.services}</td>
//                 <td style="color: #0F4229;">${item.text}</td>               
//                 <td style="color: #0F4229;">
//                     <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
//                     <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
//                 </td>
//             `;
//             tableBody.appendChild(row);

//             const editBtn = row.querySelector('.edit-btn');
//             editBtn.addEventListener('click', function () {
//                 const id = editBtn.getAttribute('data-id');
//                 console.log("Edit button clicked for ID: " + id);

//                 fetch(`http://localhost:8181/Gardener/auth/get-contact-us/${id}`, {
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

//                         localStorage.setItem('updateData', JSON.stringify(data.data));


//                         window.location.href = 'update-contact.html';
//                     })
//                     .catch(error => {
//                         console.error('Error fetching service data:', error);
//                     });
//             });


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

//     fetch(`http://localhost:8181/Gardener/auth/delete-contact-us/${id}`, {
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

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: 'Service has been deleted successfully.',
//             }).then((result) => {

//                 getData();
//             });
//         })
//         .catch(error => {
//             console.error('Error deleting service:', error);

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: 'Failed to delete the service. Please try again later.',
//             });
//         });
// }

// // -----------------------------------update the data by id-------------------------------------------



// function updateData() {
//     var id = document.getElementById('id').value;
//     var name = document.getElementById('name').value;
//     var email = document.getElementById('email').value;
//     var services = document.getElementById('services').value;
//     var text = document.getElementById('text').value;
//     var phone = document.getElementById('phone').value;
//     var jwtToken = localStorage.getItem('jwtToken');


//     if (!name || !text || !email || !phone) {
//         alert('Please fill in all required fields.');
//         return;
//     }


//     if (!jwtToken) {
//         alert('JWT token is missing. Please log in again.');
//         return;
//     }


//     var data = {
//         name: name,
//         email: email,
//         services: services,
//         text: text,
//         phone: phone
//     };

//     fetch(`http://localhost:8181/Gardener/auth/update-contact-us/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json',
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

//                     window.location.href = 'Contact-Us.html';
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