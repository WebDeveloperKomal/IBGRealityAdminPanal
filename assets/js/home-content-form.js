// ----------------save the data-------------------------------------------------

function HomeContentsave() {

    var HomeContentsave = {
        text: document.getElementById('text').value,
        text1: document.getElementById('text1').value,
        text2: document.getElementById('text2').value,
        facts: document.getElementById('facts').value,
        facts_text: document.getElementById('facts_text').value,
        nations: document.getElementById('nations').value,
        members: document.getElementById('members').value,
        awards: document.getElementById('awards').value,
        satisfied_customer: document.getElementById('satisfied_customer').value,
        middle_text: document.getElementById('middle_text').value,
        middle_text1: document.getElementById('middle_text1').value,
        cus_review: document.getElementById('cus_review').value,
        cus_review_text: document.getElementById('cus_review_text').value,
    };

    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', JSON.stringify(HomeContentsave));

    if (!HomeContentsave.text || !HomeContentsave.text1 || !HomeContentsave.text2 || !HomeContentsave.facts || !HomeContentsave.facts_text || !HomeContentsave.nations || !HomeContentsave.members || !HomeContentsave.awards || !HomeContentsave.satisfied_customer || !HomeContentsave.middle_text || !HomeContentsave.middle_text1 || !HomeContentsave.cus_review || !HomeContentsave.cus_review_text) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    fetch('http://localhost:8181/Gardener/auth/save-home-content', {
        method: 'POST',
        body: JSON.stringify(HomeContentsave),
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + jwtToken,
        },
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            // window.location.href = 'Home-content.html';
        })

        .then(data => {
            console.log('Server response:', data);

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Data has been saved successfully.',
            }).then((result) => {

                document.getElementById('text').value = '';
                document.getElementById('text1').value = '';
                document.getElementById('text2').value = '';
                document.getElementById('facts').value = '';
                document.getElementById('facts_text').value = '';
                document.getElementById('nations').value = '';
                document.getElementById('members').value = '';
                document.getElementById('awards').value = '';
                document.getElementById('satisfied_customer').value = '';
                document.getElementById('middle_text').value = '';
                document.getElementById('middle_text1').value = '';
                document.getElementById('cus_review').value = '';
                document.getElementById('cus_review_text').value = '';

                window.location.href = 'Home-content.html';

                getData();
            });
        })

        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'Home-Content-form.html';

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            });
        });
}










