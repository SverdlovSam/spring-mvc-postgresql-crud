package ru.alishev.springcourse.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;
import java.util.Date;

public class Person {
    private int id;

    @NotEmpty(message = "Surname should not be empty")
    @Size(min = 2, max = 30, message = "Surname should be between 2 and 30 characters")
    private String surname;

    @NotEmpty(message = "Name should not be empty")
    @Size(min = 2, max = 30, message = "Name should be between 2 and 30 characters")
    private String name;

    @NotEmpty(message = "Patronymic should not be empty")
    @Size(min = 2, max = 30, message = "Patronymic should be between 2 and 30 characters")
    private String patronymic;

    @Min(value = 0)
    private int workStart;


    private Timestamp birthDate;

    @NotEmpty(message = "Email should not be empty")
    @Email(message = "Email should be valid")
    private String email; // check fsdf@mail.ru

    @NotEmpty(message = "Post should not be empty")
    @Size(min = 2, max = 30, message = "Post should be between 2 and 30 characters")
    private String post;

    public Person(){}


    public Person(int id, String surname, String name, String patronymic, int workStart, Timestamp birthDate, String email, String post) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.workStart = workStart;
        this.birthDate = birthDate;
        this.email = email;
        this.post = post;
    }
    public String getSurname() {
        return surname;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public Timestamp getBirthDate() {
        return  birthDate;
    }

    public String getPost() {
        return post;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public void setBirthDate(Timestamp birthDate) {
        this.birthDate = birthDate;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getWorkStart() {
        return workStart;
    }

    public void setWorkStart(int workStart) {
        this.workStart = workStart;
    }
}
