package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/user")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class UserController {

    UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> addUser(@RequestBody @Valid UserRequest request) {
        var userResponse = userService.addUser(request);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(userResponse).build();
        return apiResponse;
    }

    @PostMapping("/login")
    public ApiResponse<UserService.LoginResponse> login(@RequestBody @Valid UserRequest request) {
        var userResponse = userService.login(request);
        ApiResponse<UserService.LoginResponse> apiResponse = ApiResponse.<UserService.LoginResponse>builder().result(userResponse).build();
        return apiResponse;
    }

    @PostMapping("/verify")
    public ApiResponse<UserResponse> verifyAccount(@RequestParam String email, @RequestParam String token) {
        var userResponse = userService.verifyAccount(email, token);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(userResponse).build();
        return apiResponse;
    }
}
