// ----------------------save the data--------------------------------------

function previewImage() {
    const imagePath = document.getElementById('imagePath').files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (imagePath) {
        const reader = new FileReader();
        reader.onload = function (event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(imagePath);

        document.getElementById('imageFile').value = imagePath.name;
    } else {
        imagePreview.style.display = 'none';
    }
}


function saveData() {
    var title = document.getElementById('title').value;
    var text = document.getElementById('text').value;
    var imagePath = document.getElementById('imagePath').files[0];
    var page = document.getElementById('page').value;

    var formData = new FormData();
    formData.append('data', JSON.stringify({
        title: title,
        text: text,
        page: page
    }));

    if (imagePath) {
        formData.append('image', imagePath);
    }

    var jwtToken = localStorage.getItem('jwtToken');

    if (!title || !text || !imagePath || !page) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    fetch('http://localhost:8181/Gardener/auth/add-new-slider', {
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
                text: 'Data has been saved successfully.',
            }).then(() => {
                // Reset form and redirect only after successful data saving
                document.getElementById('myForm').reset();
                window.location.href = 'Home-Slider.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            }).then(() => {
                // Redirect to error page only if there's a failure in saving data
                window.location.href = 'Home-Slider-form.html';
            });
        });
}
