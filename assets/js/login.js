function getAuthToken() {
    var userCredentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log('Request Payload:', JSON.stringify(userCredentials));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    fetch("http://localhost:2222/user/login", {
        method: 'POST',
        body: JSON.stringify(userCredentials),
        headers: headers,
    })
    .then(response => {
        if (response.ok) {
            alert("Login Successfully!");
            return response.json();
        } else if (response.status === 401) {
            alert("Invalid Credentials");
            throw new Error('Invalid credentials. Please check your username and password.');
        } else {
            throw new Error('Unexpected server error. Please try again later.');
        }
    })
    .then(data => {
        console.log('Data:', data);
        if (data && data.jwtToken) {
            // Store the JWT token in local storage
            localStorage.setItem('jwtToken', data.jwtToken);
            console.log('JWT token stored successfully:', data.jwtToken); 
            alert("JWT token stored successfully:" , data.jwtToken);
            window.location.href = 'Dashboard.html';
        } else {
            throw new Error('Token not received or invalid.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to login. Please try again.');
    });
}
