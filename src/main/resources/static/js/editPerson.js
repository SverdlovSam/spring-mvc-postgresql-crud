// Получение id из параметров URL
const pathArray = window.location.pathname.split('/');
const indexOfPeople = pathArray.indexOf('people');
const personId = indexOfPeople !== -1 ? pathArray[indexOfPeople + 1] : null;



// Получение данных о человеке с сервера
fetch(`/api/people/${personId}`, {
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
    .then(person => {
        // Заполнение формы данными о человеке
        console.log(person);
        document.getElementById('surname').value = person.surname;
        document.getElementById('name').value = person.name;
        document.getElementById('patronymic').value = person.patronymic;
        document.getElementById('workStart').value = person.workStart;
        const birthDate = new Date(person.birthDate);
        document.getElementById('birthDate').value = birthDate.toISOString().split('T')[0];
        document.getElementById('email').value = person.email;
        document.getElementById('post').value = person.post;
    })
    .catch(error => console.error('Error fetching person:', error));

// Обработка отправки формы
document.getElementById('editForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Получение данных из формы
    const updatedPerson = {
        surname: document.getElementById('surname').value,
        name: document.getElementById('name').value,
        patronymic: document.getElementById('patronymic').value,
        workStart: document.getElementById('workStart').value,
        birthDate: document.getElementById('birthDate').value,
        email: document.getElementById('email').value,
        post: document.getElementById('post').value
    };

    // Отправка запроса на сервер для обновления данных
    fetch(`/api/people/${personId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(updatedPerson)
    })
        .then(response => {
            if (response.ok) {
                openSuccessModal();
            } else {
                alert('Failed to update person');
            }
        })
        .catch(error => console.error('Error updating person:', error));
});

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