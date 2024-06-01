

function saveData() {
    var saveData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        information: document.getElementById('information').value,
    };

    // Retrieve JWT token from localStorage
    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', JSON.stringify(saveData));

    if (!saveData.name || !saveData.title || !saveData.information) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        // JWT token is missing, prompt user to log in again
        alert('JWT token is missing. Please log in again.');
        // Redirect user to login page or perform any other action as necessary
        return;
    }

    fetch('http://localhost:8181/Gardener/auth/save-services-content', {
        method: 'POST',
        body: new URLSearchParams(saveData), // Convert object to URLSearchParams
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
        // Show SweetAlert upon successful save
        Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Data has been saved successfully.',
        }).then((result) => {
            // Optionally, you can perform additional actions after the alert is closed
            // For example, you can clear form fields or reload data
            document.getElementById('name').value = '';
            document.getElementById('title').value = '';
            document.getElementById('information').value = '';
            window.location.href = 'Services.html';
            // Reload data if needed
            getData();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'Services-form.html';
        // Show SweetAlert for error
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to save data. Please try again.',
        });
    });
}



