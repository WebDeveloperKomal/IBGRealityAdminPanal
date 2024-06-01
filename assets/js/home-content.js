// -----------------------get all the data-----------------------------------
var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/Gardener/auth/get-all-home-content', {
        method: 'GET',
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
            console.log(data);
            populateTable(data.data);
            // alert("Get all the Successfully");
        })

        .catch(error => {
            console.error('Error fetching data:', error);
        })
}

function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td style="color: #0F4229;">${index + 1}</td>
            <td style="color: #0F4229;">${item.text}</td>
            <td style="color: #0F4229;">${item.text1}</td>
            <td style="color: #0F4229;">${item.text2}</td>
            <td style="color: #0F4229;">${item.facts}</td>
            <td style="color: #0F4229;">${item.facts_text}</td>
            <td style="color: #0F4229;">${item.nations}</td>
            <td style="color: #0F4229;">${item.members}</td>
            <td style="color: #0F4229;">${item.awards}</td>
            <td style="color: #0F4229;">${item.satisfied_customer}</td>
            <td style="color: #0F4229;">${item.middle_text}</td>
            <td style="color: #0F4229;">${item.middle_text1}</td>
            <td style="color: #0F4229;">${item.cus_review}</td>
            <td style="color: #0F4229;">${item.cus_review_text}</td>
            
            <td style="color: #0F4229;">
            <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
            <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i> Delete</a>
            </td>
        `;

            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);

                fetch(`http://localhost:8181/Gardener/auth/get-home-content/${id}`, {
                    method: 'GET',
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

                        window.location.href = `update-home-content.html?id=${id}&text=${data.data.text}&text1=${data.data.text1}&text2=${data.data.text2}&facts=${data.data.facts}&facts_text=${data.data.facts_text}&nations=${data.data.nations}&members=${data.data.members}&awards=${data.data.awards}&satisfied_customer=${data.data.satisfied_customer}&middle_text=${data.data.middle_text}&middle_text1=${data.data.middle_text1}&cus_review=${data.data.cus_review}&cus_review_text=${data.data.cus_review_text}`;
                    })
                    .catch(error => {
                        console.error('Error fetching home content data:', error);
                    });
            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteContent(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


// -----------------------------delete the data-------------------------------------------------------

function deleteContent(id) {
    jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/delete-home-content/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },

    })
        .then(response => {
            if (!response.ok) {
                throw new error('Network respose was not ok');
            }
            return response.json();
        })

        .then(data => {
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'home content has been deleted successfully.',
            }).then((result) => {

                getData();
            });
        })

        .catch(error => {
            console.error('Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the home content. Please try again later.',
            });
        });
}

// --------------------------------update data by id----------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');


    fetch(`http://localhost:8181/Gardener/auth/get-home-content/${id}`, {
        method: 'GET',
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

            document.getElementById('text').value = data.data.text;
            document.getElementById('text1').value = data.data.text1;
            document.getElementById('text2').value = data.data.text2;
            document.getElementById('facts').value = data.data.facts;
            document.getElementById('facts_text').value = data.data.facts_text;
            document.getElementById('nations').value = data.data.nations;
            document.getElementById('members').value = data.data.members;
            document.getElementById('awards').value = data.data.awards;
            document.getElementById('satisfied_customer').value = data.data.satisfied_customer;
            document.getElementById('middle_text').value = data.data.middle_text;
            document.getElementById('middle_text1').value = data.data.middle_text1;
            document.getElementById('cus_review').value = data.data.cus_review;
            document.getElementById('cus_review_text').value = data.data.cus_review_text;
        })
        .catch(error => {
            console.error('Error fetching home-content data:', error);
        });


    document.getElementById('updateForm').addEventListener('submit', function (event) {
        event.preventDefault();


        const updatedText = document.getElementById('text').value;
        const updatedText1 = document.getElementById('text1').value;
        const updatedText2 = document.getElementById('text2').value;
        const updatedFacts = document.getElementById('facts').value;
        const updatedFacts_text = document.getElementById('facts_text').value;
        const updatedNations = document.getElementById('nations').value;
        const updatedMembers = document.getElementById('members').value;
        const updatedAwards = document.getElementById('awards').value;
        const updatedSatisfied_customer = document.getElementById('satisfied_customer').value;
        const updatedMiddle_text = document.getElementById('middle_text').value;
        const updatedMiddle_text1 = document.getElementById('middle_text1').value;
        const updatedCus_review = document.getElementById('cus_review').value;
        const updatedCus_review_text = document.getElementById('cus_review_text').value;


        updateHomeContent(id, updatedText, updatedText1, updatedText2, updatedFacts, updatedFacts_text, updatedNations, updatedMembers, updatedAwards, updatedSatisfied_customer, updatedMiddle_text, updatedMiddle_text1, updatedCus_review, updatedCus_review_text);
    });
});



function updateHomeContent(id, text, text1, text2, facts, facts_text, nations, members, awards, satisfied_customer, middle_text, middle_text1, cus_review, cus_review_text) {
    const jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/Gardener/auth/update-home-content/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            text1: text1,
            text2: text2,
            facts: facts,
            facts_text: facts_text,
            nations: nations,
            members: members,
            awards: awards,
            satisfied_customer: satisfied_customer,
            middle_text: middle_text,
            middle_text1: middle_text1,
            cus_review: cus_review,
            cus_review_text: cus_review_text
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'home content has been updated successfully.',
            }).then((result) => {
                window.location.href = 'Home-content.html';
            });
        })
        .catch(error => {
            console.error('Error updating home content:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update the home content. Please try again later.',
            });
        });
}
