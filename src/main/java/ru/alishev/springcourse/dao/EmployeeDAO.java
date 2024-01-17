package ru.alishev.springcourse.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import ru.alishev.springcourse.models.Employee;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class EmployeeDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public EmployeeDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Employee> index(){
        return jdbcTemplate.query("SELECT * FROM Person", new BeanPropertyRowMapper<>(Employee.class));
    }

    public Employee show(int id){
        return jdbcTemplate.query("SELECT * FROM Person WHERE id=?", new Object[]{id},
                        new BeanPropertyRowMapper<>(Employee.class)).stream().findAny().orElse(null);
    }

    public void save(Employee employee){
        jdbcTemplate.update("INSERT INTO Person(surname, name, patronymic, work_start, birth_date, email, post) " +
                        "VALUES(?,?,?,?,?,?,?)", employee.getSurname(),
                employee.getName(), employee.getPatronymic(), employee.getWorkStart(), employee.getBirthDate(),
                employee.getEmail(), employee.getPost());
    }

    public boolean update(int id, Employee updatedEmployee){
        int rowsUpdated = jdbcTemplate.update("UPDATE Person SET surname=?, name=?, patronymic=?, work_start=?," +
                        "birth_date=?, email=?, post=? WHERE id=?", updatedEmployee.getSurname(),
                updatedEmployee.getName(), updatedEmployee.getPatronymic(), updatedEmployee.getWorkStart(),
                updatedEmployee.getBirthDate(), updatedEmployee.getEmail(), updatedEmployee.getPost(), id);
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
        List<Employee> people = create1000People();

        long before = System.currentTimeMillis();

        for(Employee employee : people) {
            jdbcTemplate.update("INSERT INTO Person VALUES(?,?,?,?,?,?,?,?)", employee.getId(), employee.getSurname(),
                    employee.getName(), employee.getPatronymic(), employee.getWorkStart(), employee.getBirthDate(),
                    employee.getEmail(), employee.getPost());
        }

        long after = System.currentTimeMillis();
        System.out.println("Time: " + (after -before));
    }

    public void testBatchUpdate(){
        List<Employee> people = create1000People();

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

    private List<Employee> create1000People() {
        List<Employee> people = new ArrayList<>();

        for (int i = 0; i < 1000; i++)
            people.add(new Employee(i, "Surname" + i,"Name" + i, "Patronymic" + i, 1990 + i,
                    new Timestamp(System.currentTimeMillis()), "test" + i + "mail.ru", "test"));

        return people;
    }
}





















