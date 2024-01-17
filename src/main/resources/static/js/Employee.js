export default class Employee {
    constructor(id, surname, name, patronymic, workStart, birthDate, email, post) {
        this._id = id;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.workStart = workStart;
        this.birthDate = birthDate;
        this.email = email;
        this.post = post;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    getName() {
        return this.name;
    }

    getSurname(){
        return this.surname;
    }

    getPatronymic(){
        return this.patronymic;
    }

    getWorkStart(){
        return this.workStart;
    }

    getBirthDate(){
        return this.birthDate
    }


    getFIO(){
        return this.surname + ' ' + this.name + ' ' + this.patronymic;
    }

    setName(name) {
        this.name = name;
    }

    getWorkPeriod() {
        let currentTime = new Date()
        return currentTime.getFullYear() - this.workStart;
    }

    getBirthDateString() {
        let yyyy = this.birthDate.getFullYear();
        let mm = this.birthDate.getMonth() + 1;
        let dd = this.birthDate.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '.' + mm + '.' + yyyy;
    }

    getAge() {
        const today = new Date();
        let age = today.getFullYear() - this.birthDate.getFullYear();
        let m = today.getMonth() - this.birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
            age--;
        }
        return age;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPost(){
        return this.post;
    }

    ageToStr(age) {
        let txt;
        let count = age % 100;
        if (count >= 5 && count <= 20) {
            txt = 'лет';
        } else {
            count = count % 10;
            if (count === 1) {
                txt = 'год';
            } else if (count >= 2 && count <= 4) {
                txt = 'года';
            } else {
                txt = 'лет';
            }
        }
        return age + " " + txt;
    }
}