package ru.alishev.springcourse.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import ru.alishev.springcourse.models.Person;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class PersonDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PersonDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Person> index(){
        return jdbcTemplate.query("SELECT * FROM Person", new BeanPropertyRowMapper<>(Person.class));
    }

    public Person show(int id){
        return jdbcTemplate.query("SELECT * FROM Person WHERE id=?", new Object[]{id},
                        new BeanPropertyRowMapper<>(Person.class)).stream().findAny().orElse(null);
    }

    public void save(Person person){
        jdbcTemplate.update("INSERT INTO Person(surname, name, patronymic, work_start, birth_date, email, post) " +
                        "VALUES(?,?,?,?,?,?,?)",person.getSurname(),
                person.getName(), person.getPatronymic(), person.getWorkStart(), person.getBirthDate(),
                person.getEmail(), person.getPost());
    }

    public boolean update(int id, Person updatedPerson){
        int rowsUpdated = jdbcTemplate.update("UPDATE Person SET surname=?, name=?, patronymic=?, work_start=?," +
                        "birth_date=?, email=?, post=? WHERE id=?", updatedPerson.getSurname(),
                updatedPerson.getName(), updatedPerson.getPatronymic(), updatedPerson.getWorkStart(),
                updatedPerson.getBirthDate(), updatedPerson.getEmail(), updatedPerson.getPost(), id);
        return rowsUpdated > 0;
    }

    public boolean delete(int id){
        int rowsDeleted = jdbcTemplate.update("DELETE FROM Person WHERE id=?", id);
        return rowsDeleted > 0;
    }

    ///////////////////////////
    ///  Тестируем производительность пакетной вставки
    //////////////////////////

    public void testMultipleUpdate(){
        List<Person> people = create1000People();

        long before = System.currentTimeMillis();

        for(Person person : people) {
            jdbcTemplate.update("INSERT INTO Person VALUES(?,?,?,?,?,?,?,?)", person.getId(),person.getSurname(),
                    person.getName(), person.getPatronymic(), person.getWorkStart(), person.getBirthDate(),
                    person.getEmail(), person.getPost());
        }

        long after = System.currentTimeMillis();
        System.out.println("Time: " + (after -before));
    }

    public void testBatchUpdate(){
        List<Person> people = create1000People();

        long before = System.currentTimeMillis();

        jdbcTemplate.batchUpdate("INSERT INTO Person VALUES(?, ?, ?, ?)",
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
                        preparedStatement.setInt(1, people.get(i).getId());
                        preparedStatement.setString(2,people.get(i).getSurname());
                        preparedStatement.setString(3, people.get(i).getName());
                        preparedStatement.setString(4,people.get(i).getPatronymic());
                        preparedStatement.setInt(5, people.get(i).getWorkStart());
                        preparedStatement.setTimestamp(6, people.get(i).getBirthDate());
                        preparedStatement.setString(7, people.get(i).getEmail());
                        preparedStatement.setString(8, people.get(i).getPost());
                    }

                    @Override
                    public int getBatchSize() {
                        return people.size();
                    }
                });

        long after = System.currentTimeMillis();
        System.out.println("Time: " + (after - before));
    }

    private List<Person> create1000People() {
        List<Person> people = new ArrayList<>();

        for (int i = 0; i < 1000; i++)
            people.add(new Person(i, "Surname" + i,"Name" + i, "Patronymic" + i, 1990 + i,
                    new Timestamp(System.currentTimeMillis()), "test" + i + "mail.ru", "test"));

        return people;
    }
}





















