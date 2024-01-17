import { removeEmployeeFromList } from "./script.js";

const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;
let deletionInProgress = false;
const timeout = 800;


const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            const closestPopup = el.closest('.popup');
            if (closestPopup) {
                popupClose(closestPopup);
            } else {
                // Если это крестик confirmDeleteModal, то выполняем действие кнопки "Cancel"
                const confirmDeleteModal = document.getElementById('confirmDeleteModal');
                if (confirmDeleteModal.contains(el)) {
                    const cancelDeleteButton = confirmDeleteModal.querySelector('#cancelDelete');
                    if (cancelDeleteButton) {
                        cancelDeleteButton.click();
                    }
                }
            }
            e.preventDefault();
        });
    }
}

export function popupOpen(currentPopup, employee) {
    if (currentPopup && unlock && employee) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }

        currentPopup.classList.add('open');
        // Найти элемент .popup__content внутри текущего попапа
        const popupContent = currentPopup.querySelector('.popup__text');

        console.log(employee);
        // Заполнить контент данными из объекта Employee
        popupContent.innerHTML = `
            <div class="popup-header">
                <h2>${employee.getFIO()}</h2>
            </div>
            <div class="popup-body">
                <div class="newPopup-content">
                    <div class="newPopup-text">
                        <p><strong>Post:</strong> ${employee.getPost()}</p>
                        <p><strong>Birth date:</strong> ${employee.getBirthDateString()}</p>
                        <p><strong>Age:</strong> ${employee.getAge()}</p>
                        <p><strong>Year of work start:</strong> ${employee.getWorkStart()}</p>
                        <p><strong>Period of work:</strong> ${employee.ageToStr(employee.getWorkPeriod())}</p>
                        <p><strong>Email:</strong> ${employee.getEmail()}</p>
                    </div>
                    <div class="popup-image">
                        <img src="/static/images/img.jpg" alt="Person Image">
                    </div>
                </div>
                <div class="popup-buttons">
                    <button class="popup-button btn btn-success" id="editButton">Edit</button>
                    <button class="popup-button btn btn-danger" id="deleteButton" >Delete</button>
                </div>
            </div>
        `;


        const editButton = popupContent.querySelector('#editButton');
        const deleteButton = popupContent.querySelector('#deleteButton');

        editButton.addEventListener('click', function (e) {
            window.location.href = `/people/${employee.getId()}/edit`;
        });

        deleteButton.addEventListener('click', function (e) {
            e.stopPropagation();
            deletePersonHandler(currentPopup, employee);
        });

        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });

    }
}


let confirmDeleteHandler = null;
let cancelDeleteHandler = null;

function deletePersonHandler(currentPopup, person) {
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    confirmDeleteModal.classList.add('open', 'confirm-delete');

    const confirmDeleteButton = confirmDeleteModal.querySelector('#confirmDelete');
    const cancelDeleteButton = confirmDeleteModal.querySelector('#cancelDelete');

    popupClose(currentPopup, false);

    // Удалите предыдущие обработчики событий, если они существуют
    if (confirmDeleteHandler) {
        confirmDeleteButton.removeEventListener('click', confirmDeleteHandler);
    }
    if (cancelDeleteHandler) {
        cancelDeleteButton.removeEventListener('click', cancelDeleteHandler);
    }

    // Создайте новые обработчики событий и сохраните их в переменных
    confirmDeleteHandler = function () {
        fetch(`/api/people/${person.getId()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log('Сотрудник успешно удален!');
                    confirmDeleteModal.classList.remove('open');
                    confirmDeleteModal.classList.remove('confirm-delete');
                    removeEmployeeFromList(person.getId());
                } else {
                    console.error('Не удалось удалить сотрудника');
                    popupOpen(currentPopup, person);
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении сотрудника:', error);
                popupOpen(currentPopup, person);
            })
            .finally(() => {
                deletionInProgress = false;
            });
    };

    cancelDeleteHandler = function () {
        confirmDeleteModal.classList.remove('open');
        confirmDeleteModal.classList.remove('confirm-delete');
        popupOpen(currentPopup, person);
    };

    // Добавьте новые обработчики событий
    confirmDeleteButton.addEventListener('click', confirmDeleteHandler);
    cancelDeleteButton.addEventListener('click', cancelDeleteHandler);
}

function popupClose(popupActive, doUnlock = true, e){
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock){
            bodyUnLock();
        }
        if (e) {
            e.stopPropagation();
        }
    }
}

function bodyLock(){
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock(){
    setTimeout(function (){
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', function (e){
    if (e.which === 27){
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

(function (){
    // проверяем поддрежку
    if (!Element.prototype.closest){
        // реализуем
        Element.prototype.closest = function (css){
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();

(function () {
    // проверяем поддержку
    if (!Element.prototype.matches) {
        // определяем свойство
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
})();