package ru.alishev.springcourse.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.alishev.springcourse.dao.PersonDAO;
import ru.alishev.springcourse.models.Person;

import java.util.List;

@RestController
@RequestMapping("/api/people")
public class PeopleApiController {

    private final PersonDAO personDAO;

    @Autowired
    public PeopleApiController(PersonDAO personDAO) {
        this.personDAO = personDAO;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Person>> index() {
        List<Person> people = personDAO.index();
        return ResponseEntity.ok(people);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Person> show(@PathVariable("id") int id) {
        Person person = personDAO.show(id);
        if (person != null) {
            return ResponseEntity.ok(person);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<String> create(@RequestBody @Valid Person person, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        personDAO.save(person);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<String> update(@PathVariable("id") int id, @RequestBody @Valid Person person, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        if (personDAO.update(id, person)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") int id) {
        if (personDAO.delete(id)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/test-batch-update")
    public ResponseEntity<String> testBatchUpdate() {
        personDAO.testBatchUpdate();
        return ResponseEntity.ok("Batch update completed successfully");
    }

    @PostMapping("/test-multiple-update")
    public ResponseEntity<String> testMultipleUpdate() {
        personDAO.testMultipleUpdate();
        return ResponseEntity.ok("Multiple update completed successfully");
    }
}