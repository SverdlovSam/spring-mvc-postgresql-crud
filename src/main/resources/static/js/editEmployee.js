// Получение id из параметров URL
const pathArray = window.location.pathname.split('/');
const indexOfEmployee = pathArray.indexOf('people');
const employeeId = indexOfEmployee !== -1 ? pathArray[indexOfEmployee + 1] : null;



// Получение данных о человеке с сервера
fetch(`/api/people/${employeeId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).then(response => {
        if (!response.ok) {
            // Вывод содержимого ответа в консоль
            return response.text().then(text => {
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
            });
        }
        return response.json();
    })
    .then(employee => {
        // Заполнение формы данными о человеке
        console.log(employee);
        document.getElementById('surname').value = employee.surname;
        document.getElementById('name').value = employee.name;
        document.getElementById('patronymic').value = employee.patronymic;
        document.getElementById('workStart').value = employee.workStart;
        const birthDate = new Date(employee.birthDate);
        document.getElementById('birthDate').value = birthDate.toISOString().split('T')[0];
        document.getElementById('email').value = employee.email;
        document.getElementById('post').value = employee.post;
    })
    .catch(error => console.error('Error fetching person:', error));


document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.addEventListener('load', function() {
        const form = document.querySelector('.needs-validation');
        const createButton = document.getElementById('createButton');

        createButton.addEventListener('click', function(event) {
            event.preventDefault();

            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {

                const updatedEmployee = {
                    surname: document.getElementById('surname').value,
                    name: document.getElementById('name').value,
                    patronymic: document.getElementById('patronymic').value,
                    workStart: document.getElementById('workStart').value,
                    birthDate: document.getElementById('birthDate').value,
                    email: document.getElementById('email').value,
                    post: document.getElementById('post').value
                };

                // Отправка запроса на сервер для обновления данных
                fetch(`/api/people/${employeeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updatedEmployee)
                })
                    .then(response => {
                        if (response.ok) {
                            openSuccessModal();
                        } else {
                            alert('Failed to update person');
                        }
                    })
                    .catch(error => console.error('Error updating person:', error));
            }

            form.classList.add('was-validated');
        }, false);
    });

    window.addEventListener('error', function(event) {
        console.error('Unhandled error:', event.error);
    });
});

// // Обработка отправки формы
// document.getElementById('editForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//
//     // Получение данных из формы
//     const updatedEmployee = {
//         surname: document.getElementById('surname').value,
//         name: document.getElementById('name').value,
//         patronymic: document.getElementById('patronymic').value,
//         workStart: document.getElementById('workStart').value,
//         birthDate: document.getElementById('birthDate').value,
//         email: document.getElementById('email').value,
//         post: document.getElementById('post').value
//     };
//
//     // Отправка запроса на сервер для обновления данных
//     fetch(`/api/people/${employeeId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify(updatedEmployee)
//     })
//         .then(response => {
//             if (response.ok) {
//                 openSuccessModal();
//             } else {
//                 alert('Failed to update person');
//             }
//         })
//         .catch(error => console.error('Error updating person:', error));
// });

function openSuccessModal() {
    const successModal = document.getElementById('successModal');
    const modalContent = successModal.querySelector('.popup__content');

    successModal.classList.add('open', 'success');
    modalContent.classList.add('animation');

    setTimeout(() => {
        window.location.href = '/people';
    }, 2000);
}

document.getElementById('surname').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('name').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('patronymic').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('workStart').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('birthDate').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('email').addEventListener('focus', function () {
    clearInput(this);
});

document.getElementById('post').addEventListener('focus', function () {
    clearInput(this);
});

function clearInput(input) {
    // Очищаем значение при фокусе
    input.value  = '';
}