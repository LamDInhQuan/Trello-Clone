package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.RequestContext;
import com.coladz2812.trello_api.dto.request.StudentRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.StudentResponse;
import com.coladz2812.trello_api.model.Student;
import com.coladz2812.trello_api.repository.StudentRepository;
import com.coladz2812.trello_api.service.StudentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }

public class ApiController {

    StudentService studentService;


    @GetMapping("/test")
    String sayHello() {
        return "Hello moi nguoi ";
    }

    @PostMapping("/addStudent")
    public ApiResponse<StudentResponse> addStudent(@RequestBody @Valid StudentRequest request) {
        StudentResponse studentResponse = studentService.addStudent(request);
        ApiResponse<StudentResponse> apiResponse = ApiResponse.<StudentResponse>builder().result(studentResponse).build();
        return apiResponse;
    }

    @GetMapping("/getStudent/{id}")
    public ApiResponse<StudentResponse> getStudent(@PathVariable Integer id) {
        StudentResponse studentResponse = studentService.getStudenById(id);
        ApiResponse<StudentResponse> apiResponse = ApiResponse.<StudentResponse>builder().result(studentResponse).build();
        return apiResponse;
    }
}
// mongodb
// username : coladz2812
// pass : jJdl6I8vBAQyOrN9