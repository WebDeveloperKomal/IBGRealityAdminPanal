document.addEventListener('DOMContentLoaded', function () {
    // On page load, fetch data and populate the tables and counts
    getContactData();
    getQuoteData();
    getCommentData();
    getData();
});

// Function to fetch contact data
function getContactData() {
    fetch('http://localhost:8080/auth/get-all-contact-list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Contact data received:", data);
            updateContactCount(data.length);
            populateContactTable(data);
        })
        .catch(error => {
            console.error('Error fetching or processing contact data:', error);
        });
}

// Function to fetch quote data
function getQuoteData() {
    fetch('http://localhost:8080/auth/get-all-quote')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Quote data received:", data);
            updateQuoteCount(data.length);
            populateQuoteTable(data);
        })
        .catch(error => {
            console.error('Error fetching or processing quote data:', error);
        });
}

// Function to fetch comment data
function getCommentData() {
    fetch('http://localhost:8080/auth/get-all-comment')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Comment data received:", data);
            updateCommentCount(data.length);
            populateCommentTable(data);
        })
        .catch(error => {
            console.error('Error fetching or processing comment data:', error);
        });
}

function getData() {
    fetch('http://localhost:8080/auth/get-all-team-members-list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            updateTeamMemberCount(data);
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
        });
}

function updateContactCount(count) {
    const contactCountElement = document.getElementById('contactCount');
    contactCountElement.textContent = count;
}

function updateQuoteCount(count) {
    const quoteCountElement = document.getElementById('quoteCount');
    quoteCountElement.textContent = count;
}

// Function to update the comment count
function updateCommentCount(count) {
    const commentCountElement = document.getElementById('commentCount');
    commentCountElement.textContent = count;
}

function updateTeamMemberCount(data) {
    const count = data.length;
    document.getElementById('teamMemberCount').textContent = `${count}`;
}

function populateContactTable(data) {
    const tableBody = document.getElementById('contactTableBody'); // Updated ID for contact table
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

        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const id = deleteBtn.getAttribute('data-id');
            console.log("Delete button clicked for ID: " + id);

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
                    fetch(`http://localhost:8080/auth/delete-contact/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete contact');
                        }
                        console.log("Contact deleted successfully");
                        getContactData();
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

function populateQuoteTable(data) {
    const tableBody = document.getElementById('quoteTableBody'); // Updated ID for quote table
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.id}</td>
            <td>${item.companyName}</td>
            <td>${item.email}</td>
            <td>${item.phoneNumber}</td>
            <td>${item.purpose}</td>
            <td>${item.contract}</td>
            <td>${item.location}</td>
            <td>${item.website}</td>
            <td>${item.areaSqft}</td>
            <td>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);

        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const id = deleteBtn.getAttribute('data-id');
            console.log("Delete button clicked for ID: " + id);

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
                    fetch(`http://localhost:8080/auth/delete-quote/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete quote');
                        }
                        console.log("Quote deleted successfully");
                        getQuoteData();
                    })
                    .catch(error => {
                        console.error('Error deleting quote:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to delete quote. Please try again later.',
                        });
                    });
                }
            });
        });
    });
}


// Function to populate the comment table
function populateCommentTable(data) {
    const tableBody = document.getElementById('dataTableBody'); // Ensure this ID is correct
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.number}</td>
            <td>${item.comment}</td>
            <td>${item.blogId}</td>
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
                    fetch(`http://localhost:8080/auth/delete-comment/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete comment');
                        }
                        console.log("Comment deleted successfully");
                        // If deletion is successful, reload the data
                        getCommentData();
                    })
                    .catch(error => {
                        console.error('Error deleting comment:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to delete comment. Please try again later.',
                        });
                    });
                }
            });
        });
    });
}
