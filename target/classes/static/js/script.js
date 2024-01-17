import Employee from "./Employee.js";
import { popupOpen } from "./popups.js";

let employees = [];

const $employeeList = document.getElementById('employees-list'),
    $employeeListTHALL = document.querySelectorAll('.employee-table th')

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
            let employee = new Employee(
                item.id,
                item.surname,
                item.name,
                item.patronymic,
                item.workStart,
                new Date(item.birthDate),
                item.email,
                item.post);
            employees.push(employee);
        });
        render();
        //Обработка данных
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
    });

function newEmployeeTR(employee) {
    const $employeeTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birthDateTD = document.createElement('td'),
        $workStartTD = document.createElement('td'),
        $postTD = document.createElement('td')



    const $fioLink = document.createElement('a');
    $fioLink.href = '#popup';
    $fioLink.textContent = employee.getFIO();

    // Устанавливаем класс для ссылки
    $fioLink.classList.add('try__popup', 'popup-link', 'no-hover-effect');

    //Устанавливаем атрибуты данных для каждого человека
    $fioLink.setAttribute('data-employee-id', employee.getId());
    $fioLink.setAttribute('data-employee-surname', employee.getSurname());
    $fioLink.setAttribute('data-employee-name', employee.getName());
    $fioLink.setAttribute('data-employee-patronymic', employee.getPatronymic());
    $fioLink.setAttribute('data-employee-workStart', employee.getWorkStart());
    $fioLink.setAttribute('data-employee-birthDate', employee.getBirthDate());
    $fioLink.setAttribute('data-employee-email', employee.getEmail());
    $fioLink.setAttribute('data-employee-post', employee.getPost());

    $fioLink.addEventListener('click', function(event) {
        event.preventDefault();
        const employeeId = $fioLink.getAttribute('data-employee-id');
        const employeeSurname = $fioLink.getAttribute('data-employee-surname')
        const employeeName = $fioLink.getAttribute('data-employee-name');
        const employeePatronymic = $fioLink.getAttribute('data-employee-patronymic');
        const employeeWorkStart = $fioLink.getAttribute('data-employee-workStart');
        const employeeBirthDate = $fioLink.getAttribute('data-employee-birthDate');
        const employeeEmail = $fioLink.getAttribute('data-employee-email');
        const employeePost = $fioLink.getAttribute('data-employee-post');

        // // Создаем объект Employee
        const employee = new Employee(employeeId, employeeSurname, employeeName, employeePatronymic, employeeWorkStart,
            new Date(employeeBirthDate), employeeEmail, employeePost);

        // Открываем попап с данными о человеке
        popupOpen(document.getElementById('popup'), employee);
    });

    $fioTD.append($fioLink);
    $birthDateTD.textContent = employee.getBirthDateString() + ' (' + employee.ageToStr(employee.getAge()) + ')'
    $workStartTD.textContent = employee.workStart + ' (' + employee.ageToStr(employee.getWorkPeriod()) + ')'
    $postTD.textContent = employee.post

    $employeeTR.append($fioTD)
    $employeeTR.append($birthDateTD)
    $employeeTR.append($workStartTD)
    $employeeTR.append($postTD)


    return $employeeTR;
}

// Получить сортировку массива по параметрам
function getSortEmployees(prop, dir) {
    const peopleCopy = [...employees];
    return peopleCopy.sort(function (employeeA, employeeB){
        if ((!dir === false ? employeeA[prop] < employeeB[prop] : employeeA[prop] > employeeB[prop])){
            return -1;
        } else {
            return 1;
        }
    })
}

// Отрисовать
export function render() {
    let employeeCopy = [...employees];
    employeeCopy = getSortEmployees(column, columnDir);

    $employeeList.innerHTML = '';

    for (const employee of employeeCopy) {
        $employeeList.append(newEmployeeTR(employee));
    }
}

// События сортировки
$employeeListTHALL.forEach(element => {
    element.addEventListener('click', function (){
        column = this.dataset.column;
        columnDir = !columnDir;
        render();
    })
});

export function removeEmployeeFromList(employeeId) {
    employeeId = parseInt(employeeId);
    const index = employees.findIndex(p => p.getId() === employeeId);
    if (index !== -1) {
        employees.splice(index, 1);
    }
    render();
}

render();