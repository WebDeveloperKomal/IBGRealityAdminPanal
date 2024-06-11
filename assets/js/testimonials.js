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
            <td>
            <img src="http://localhost:8080/auth/testimonial-image/${item.id}" alt="Image" class="img-icon" data-id="${item.id}" style="width: 50px; height: 50px; cursor: pointer;">
        </td>
            <td>
            <button class="delete-btn" data-id="${item.id}">Delete</button>
            <button class="update-btn" data-id="${item.id}" data-name="${item.name}" data-designation="${item.designation}">Update</button>
            </td>
        `;
        tableBody.appendChild(row);

          // Add event listener for delete button inside the loop
          const deleteBtn = row.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', () => handleDelete(item.id));
  
          // Add event listener for image icon inside the loop
          const imgIcon = row.querySelector('.img-icon');
          imgIcon.addEventListener('click', () => handleImageClick(item.id));
  
          // Add event listener for update button inside the loop
          const updateBtn = row.querySelector('.update-btn');
          updateBtn.addEventListener('click', () => handleUpdateClick(item.id));
      });
  }

  function handleDelete(id) {
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
            fetch(`http://localhost:8080/auth/delete-testimonials/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete contact');
                }
                console.log("Contact deleted successfully");
                getData(); // Reload data
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
}

function handleImageClick(id) {
    const imageUrl = `http://localhost:8080/auth/testimonial-image/${id}`;
    window.open(imageUrl, '_blank');
}


function handleUpdateClick(id, name, designation) {
    const updateUrl = `update-testimonial.html?id=${id}&name=${encodeURIComponent(name)}&designation=${encodeURIComponent(designation)}`;
    window.location.href = updateUrl;
}


// ******************************** CONSULTATION FORM ********************************/
function saveForm(event) {
    event.preventDefault(); // Prevent form submission

    var formData = new FormData(); {
        formData.append ('name', document.getElementById('name').value);
        formData.append ('designation', document.getElementById('designation').value);
        formData.append ('comment', document.getElementById('comment').value);  
        formData.append('imageFile', document.getElementById('imageFile').files[0]);
    };

    fetch("http://localhost:8080/auth/save-testimonials", {
        method: 'POST',
        body: formData,
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
