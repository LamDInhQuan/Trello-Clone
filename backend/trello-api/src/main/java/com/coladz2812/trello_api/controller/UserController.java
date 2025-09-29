package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.request.VerifyTokenRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.dto.response.VerifyTokenResponse;
import com.coladz2812.trello_api.filter.RequestContext;
import com.coladz2812.trello_api.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RequestMapping("/user")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class UserController {

    UserService userService;
    //    RequestContext requestContext ;

    @PostMapping("/register")
    public ApiResponse<UserResponse> addUser(@RequestBody @Valid UserRequest request) {
        var userResponse = userService.addUser(request);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(userResponse).build();
        return apiResponse;
    }

    // HttpServletResponse là một interface trong Java Servlet API.
    //  Nó đại diện cho phản hồi mà server gửi về client sau khi client gửi request.
    //  Bạn dùng HttpServletResponse để:
    //  Gửi dữ liệu (HTML, JSON, file…) về client.
    //  Gửi cookie.
    //  Gửi header tùy chỉnh.
    //  Thiết lập mã trạng thái HTTP (200, 404, 403…).
    //  Chuyển hướng (redirect) client sang URL khác.
    @PostMapping("/login")
    public ApiResponse<UserService.LoginResponse> login(@RequestBody @Valid UserRequest request , HttpServletResponse response  ) {
        var userResponse = userService.login(request,response);
        ApiResponse<UserService.LoginResponse> apiResponse = ApiResponse.<UserService.LoginResponse>builder().result(userResponse).build();
//        log.error("request context : "+ requestContext.getRequestContext());
        return apiResponse;
    }

    @PostMapping("/verify") // verify account
    public ApiResponse<UserResponse> verifyAccount(@RequestParam String email, @RequestParam String token) {
        var userResponse = userService.verifyAccount(email, token);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(userResponse).build();
        return apiResponse;
    }

    @PostMapping("/verifyToken")
    public ApiResponse<VerifyTokenResponse> verifyToken(@RequestBody VerifyTokenRequest request) throws ParseException, JOSEException {
        var response = userService.verifyToken(request.getToken());
        ApiResponse<VerifyTokenResponse> apiResponse = ApiResponse.<VerifyTokenResponse>builder().result(response).build();
        return apiResponse;
    }
}
