import { removePersonFromList } from "./script.js";

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

export function popupOpen(currentPopup, person) {
    if (currentPopup && unlock && person) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }

        currentPopup.classList.add('open');
        // Найти элемент .popup__content внутри текущего попапа
        const popupContent = currentPopup.querySelector('.popup__text');

        console.log(person);
        // Заполнить контент данными из объекта Person
        popupContent.innerHTML = `
            <div class="popup-header">
                <h2>${person.getFIO()}</h2>
            </div>
            <div class="popup-body">
                <div class="newPopup-content">
                    <div class="newPopup-text">
                        <p><strong>Post:</strong> ${person.getPost()}</p>
                        <p><strong>Birth date:</strong> ${person.getBirthDateString()}</p>
                        <p><strong>Age:</strong> ${person.getAge()}</p>
                        <p><strong>Year of work start:</strong> ${person.getWorkStart()}</p>
                        <p><strong>Period of work:</strong> ${person.ageToStr(person.getWorkPeriod())}</p>
                        <p><strong>Email:</strong> ${person.getEmail()}</p>
                    </div>
                    <div class="popup-image">
                        <img src="/images/img.jpg" alt="Person Image">
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
            window.location.href = `/people/${person.getId()}/edit`;
        });

        deleteButton.addEventListener('click', function (e) {
            e.stopPropagation();
            deletePersonHandler(currentPopup, person);
        });

        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });

    }
}

function deletePersonHandler(currentPopup, person) {
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    confirmDeleteModal.classList.add('open', 'confirm-delete');

    const confirmDeleteButton = confirmDeleteModal.querySelector('#confirmDelete');
    const cancelDeleteButton = confirmDeleteModal.querySelector('#cancelDelete');

    popupClose(currentPopup, false);

    confirmDeleteButton.addEventListener('click', function () {
        fetch(`/api/people/${person.getId()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log('Person deleted successfully!');
                    confirmDeleteModal.classList.remove('open');
                    confirmDeleteModal.classList.remove('confirm-delete');
                    removePersonFromList(person.getId());
                } else {
                    console.error('Failed to delete person');
                    popupOpen(currentPopup, person);
                }
            })
            .catch(error => {
                console.error('Error deleting person:', error);
                popupOpen(currentPopup, person);
            })
            .finally(() => {
                // Сбросим флаг по завершении удаления
                deletionInProgress = false;
            });
    });

    cancelDeleteButton.addEventListener('click', function () {
        confirmDeleteModal.classList.remove('open');
        confirmDeleteModal.classList.remove('confirm-delete');
        popupOpen(currentPopup, person);
    });
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