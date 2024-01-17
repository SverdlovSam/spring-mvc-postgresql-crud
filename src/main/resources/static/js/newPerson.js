import Person from "./Person.js";

document.addEventListener('DOMContentLoaded', function() {
    (function() {
        'use strict';

        window.addEventListener('load', function() {
            const form = document.querySelector('.needs-validation');

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    const person = new Person(
                        null,
                        document.getElementById('surname').value,
                        document.getElementById('name').value,
                        document.getElementById('patronymic').value,
                        document.getElementById('workStart').value,
                        document.getElementById('birthDate').value,
                        document.getElementById('email').value,
                        document.getElementById('post').value
                    );

                    console.log(person);

                }

                form.classList.add('was-validated');
            }, false);
            const createButton = document.getElementById('createButton');
            createButton.addEventListener('click', handleCreateButtonClick);
        }, false);

        window.addEventListener('error', function(event) {
            console.error('Unhandled error:', event.error);
        });
    })();
});

function handleCreateButtonClick(event) {
    event.preventDefault();

    const apiPerson = {
        surname: document.getElementById('surname').value,
        name: document.getElementById('name').value,
        patronymic: document.getElementById('patronymic').value,
        workStart: document.getElementById('workStart').value,
        birthDate: document.getElementById('birthDate').value,
        email: document.getElementById('email').value,
        post: document.getElementById('post').value
    };

    fetch('/api/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPerson)
    })
        .then(response => {
            if (response.ok) {
                openSuccessModal();
            } else {
                alert('Failed to create person');
            }
        })
        .catch(error => console.error('Error creating person:', error));
}

function openSuccessModal() {
    const successModal = document.getElementById('successModal');
    const modalContent = successModal.querySelector('.popup__content');

    successModal.classList.add('open', 'success');
    modalContent.classList.add('animation');

    setTimeout(() => {
        window.location.href = '/people';
    }, 1000);
}
