import Person from "./Person.js";
import { popupOpen } from "./popups.js";

let people = [];

const $peopleList = document.getElementById('people-list'),
    $peopleListTHALL = document.querySelectorAll('.people-table th')

let column = 'id',
    columnDir = true

fetch('/api/people', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Добавляем данные в массив
        data.forEach(item => {
            let person = new Person(
                item.id,
                item.surname,
                item.name,
                item.patronymic,
                item.workStart,
                new Date(item.birthDate),
                item.email,
                item.post);
            people.push(person);
        });
        render();
        //Обработка данных
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
    });

function newPersonTR(person) {
    const $personTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birthDateTD = document.createElement('td'),
        $workStartTD = document.createElement('td'),
        $postTD = document.createElement('td')



    const $fioLink = document.createElement('a');
    $fioLink.href = '#popup';
    $fioLink.textContent = person.getFIO();

    // Устанавливаем класс для ссылки
    $fioLink.classList.add('try__popup', 'popup-link', 'no-hover-effect');

    //Устанавливаем атрибуты данных для каждого человека
    $fioLink.setAttribute('data-person-id', person.getId());
    $fioLink.setAttribute('data-person-surname', person.getSurname());
    $fioLink.setAttribute('data-person-name', person.getName());
    $fioLink.setAttribute('data-person-patronymic', person.getPatronymic());
    $fioLink.setAttribute('data-person-workStart', person.getWorkStart());
    $fioLink.setAttribute('data-person-birthDate', person.getBirthDate());
    $fioLink.setAttribute('data-person-email', person.getEmail());
    $fioLink.setAttribute('data-person-post', person.getPost());

    $fioLink.addEventListener('click', function(event) {
        event.preventDefault();
        const personId = $fioLink.getAttribute('data-person-id');
        const personSurname = $fioLink.getAttribute('data-person-surname')
        const personName = $fioLink.getAttribute('data-person-name');
        const personPatronymic = $fioLink.getAttribute('data-person-patronymic');
        const personWorkStart = $fioLink.getAttribute('data-person-workStart');
        const personBirthDate = $fioLink.getAttribute('data-person-birthDate');
        const personEmail = $fioLink.getAttribute('data-person-email');
        const personPost = $fioLink.getAttribute('data-person-post');

        // // Создаем объект Person
        const person = new Person(personId, personSurname, personName, personPatronymic, personWorkStart,
            new Date(personBirthDate), personEmail, personPost);

        // Открываем попап с данными о человеке
        popupOpen(document.getElementById('popup'), person);
    });

    $fioTD.append($fioLink);
    $birthDateTD.textContent = person.getBirthDateString() + ' (' + person.ageToStr(person.getAge()) + ')'
    $workStartTD.textContent = person.workStart + ' (' + person.ageToStr(person.getWorkPeriod()) + ')'
    $postTD.textContent = person.post

    $personTR.append($fioTD)
    $personTR.append($birthDateTD)
    $personTR.append($workStartTD)
    $personTR.append($postTD)


    return $personTR;
}

// Получить сортировку массива по параметрам
function getSortPeople(prop, dir) {
    const peopleCopy = [...people];
    return peopleCopy.sort(function (personA, personB){
        if ((!dir === false ? personA[prop] < personB[prop] : personA[prop] > personB[prop])){
            return -1;
        } else {
            return 1;
        }
    })
}

// Отрисовать
export function render() {
    let peopleCopy = [...people];
    peopleCopy = getSortPeople(column, columnDir);

    $peopleList.innerHTML = '';

    for (const person of peopleCopy) {
        $peopleList.append(newPersonTR(person));
    }
}

// События сортировки
$peopleListTHALL.forEach(element => {
    element.addEventListener('click', function (){
        column = this.dataset.column;
        columnDir = !columnDir;
        render();
    })
});

export function removePersonFromList(personId) {
    personId = parseInt(personId);
    const index = people.findIndex(p => p.getId() === personId);
    if (index !== -1) {
        people.splice(index, 1);
    }
    render();
}

render();