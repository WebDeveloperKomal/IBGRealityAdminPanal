document.addEventListener('DOMContentLoaded', function () {
    // On page load, fetch data and populate the table
    getData();
});

function getData() {
    fetch('http://localhost:8080/auth/get-all-testimonials-list')
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
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.designation}</td>
            <td>${item.comment}</td>
            <td>${item.image}</td>
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
                    fetch(`http://localhost:8080/auth/delete-testimonials/${id}`, {
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

// ******************************** CONSULTATION FORM ********************************/
function saveForm(event) {
    event.preventDefault(); // Prevent form submission

    var consultationForm = {
        name: document.getElementById('name').value,
        designation : document.getElementById('designation').value,
        comment : document.getElementById('comment').value,
        // image : document.getElementById('image').value,
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    fetch("http://localhost:8080/auth/save-testimonials", {
        method: 'POST',
        body: JSON.stringify(consultationForm),
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        console.log(json);
        Swal.fire({
            title: 'Success!',
            text: 'Your message has been sent successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'There was a problem sending your message.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}
