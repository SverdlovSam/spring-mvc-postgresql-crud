package ru.alishev.springcourse.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.alishev.springcourse.dao.EmployeeDAO;
import ru.alishev.springcourse.models.Employee;

@Controller
@RequestMapping("/people")
public class EmployeesController {

    private final EmployeeDAO employeeDAO;

    @Autowired
    public EmployeesController(EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }

    @GetMapping()
    public String index(Model model){
        // Получим всех людей из DAO и передадим на отображение в представление
        model.addAttribute("people", employeeDAO.index());
        return "people/index";
    }

    @GetMapping("/{id}")
    public String show(@PathVariable("id") int id, Model model){
        // Получим одного человека по его id из DAO и передадим на отображение в представление
        model.addAttribute("person", employeeDAO.show(id));
        return "people/show";
    }

    @GetMapping("/new")
    public String newPerson(@ModelAttribute("person") Employee employee){
//        model.addAttribute("person", new Employee()); - это эквивалентно параметру данного метода
        return "people/new";
    }

    @PostMapping()
    public String create(@ModelAttribute("person") @Valid Employee employee, BindingResult bindingResult){
        if(bindingResult.hasErrors())
            return "people/new";

        employeeDAO.save(employee);
        return "redirect:/people";
    }

    @GetMapping("/{id}/edit")
    public String edit(Model model, @PathVariable("id") int id) {
        model.addAttribute("person", employeeDAO.show(id));
        return "people/edit";
    }

    @PatchMapping("/{id}")
    public String update(@ModelAttribute("person") @Valid Employee employee, BindingResult bindingResult,
                         @PathVariable("id") int id){
        if(bindingResult.hasErrors())
            return "people/edit";

        employeeDAO.update(id, employee);
        return "redirect:/people";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") int id){
        employeeDAO.delete(id);
        return "redirect:/people";
    }












}
