
function getAuthToken(event) {
    event.preventDefault();

    var userCredentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log('Request Payload:', JSON.stringify(userCredentials));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    fetch("http://localhost:8080/user/login", {
        method: 'POST',
        body: JSON.stringify(userCredentials),
        headers: headers,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Credentials',
                text: 'Invalid credentials. Please check your username and password.',
            });
            throw new Error('Invalid credentials. Please check your username and password.');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Unexpected server error. Please try again later.',
            });
            throw new Error('Unexpected server error. Please try again later.');
        }
    })
    .then(data => {
        console.log('Data:', data);
        if (data && data.jwtToken) {
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('loginDetails', JSON.stringify({ username: data.username }));
            console.log('login Data stored successfully:', JSON.parse(localStorage.getItem('loginDetails'))); 
            Swal.fire({
                icon: 'success',
                title: 'Login Successfully!',
                text: 'You will be redirected to the dashboard.',
            }).then(() => {
                window.location.href = 'Dashboard.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Token Error',
                text: 'Token not received or invalid.',
            });
            throw new Error('Token not received or invalid.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Failed to login. Please try again.',
        });
    });
}