package ru.alishev.springcourse.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.alishev.springcourse.dao.EmployeeDAO;

@Controller
@RequestMapping("/test-batch-update")
public class BatchController {

    private final EmployeeDAO employeeDAO;

    @Autowired
    public BatchController(EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }

    @GetMapping()
    public String index(){
        return "batch/index";
    }

    @GetMapping("/without")
    public String withoutBatch(){
        employeeDAO.testMultipleUpdate();
        return "redirect:/people";
    }

    @GetMapping("/with")
    public String withBatch(){
        employeeDAO.testBatchUpdate();
        return "redirect:/people";
    }
}
