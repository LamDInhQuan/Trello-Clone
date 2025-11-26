package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.classValidation.UserUpdateInfo;
import com.coladz2812.trello_api.classValidation.UserUpdatePassword;
import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.request.UserRequestUpdate;
import com.coladz2812.trello_api.dto.request.VerifyTokenRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.dto.response.VerifyTokenResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.filter.RequestContext;
import com.coladz2812.trello_api.service.UserService;
import com.coladz2812.trello_api.util.FileUploadUtil;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Optional;

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
    public ApiResponse<UserService.LoginResponse> login(@RequestBody @Valid UserRequest request, HttpServletResponse response) {
        var userResponse = userService.login(request, response);
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
        var response = userService.verifyTokenResponse(request.getToken());
        ApiResponse<VerifyTokenResponse> apiResponse = ApiResponse.<VerifyTokenResponse>builder().result(response).build();
        return apiResponse;
    }

    @PostMapping("/verifyTokenRefresh")
    public ApiResponse<VerifyTokenResponse> verifyTokenRefresh(@RequestBody VerifyTokenRequest request) throws ParseException, JOSEException {
        var response = userService.verifyTokenResponse2(request.getToken());
        ApiResponse<VerifyTokenResponse> apiResponse = ApiResponse.<VerifyTokenResponse>builder().result(response).build();
        return apiResponse;
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest request, HttpServletResponse httpServletResponse) throws ParseException, JOSEException {
        Cookie cookie = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(e -> "accessToken".equals(e.getName())).findFirst().orElse(null);
        if (cookie == null || cookie.getValue().isBlank()) {
            return ApiResponse.<String>builder().result("Vui lòng đăng nhập lần đầu để sử dụng web!").build();
        }
        String token = cookie.getValue();
        userService.logout(httpServletResponse, token);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().result("Đăng xuất thành công!").build();


        return apiResponse;
    }

    @PostMapping("/refresh")
    public ApiResponse<String> refresh(HttpServletRequest request, HttpServletResponse response) throws ParseException, JOSEException {
        Cookie cookieAccessToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(e -> "accessToken".equals(e.getName())).findFirst().orElse(null);
        Cookie cookieRefreshToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(e -> "refreshToken".equals(e.getName())).findFirst().orElse(null);
        if (cookieAccessToken == null || cookieAccessToken.getValue().isBlank()) {
            throw new AppException(ErrorCode.COOKIE_NOT_FOUND);
        }
        if (cookieRefreshToken == null || cookieRefreshToken.getValue().isBlank()) {
            throw new AppException(ErrorCode.COOKIE_NOT_FOUND);
        }
        String tokenAccess = cookieAccessToken.getValue();
        String tokenRefresh = cookieRefreshToken.getValue();
        String refreshTokenResponse = userService.refreshToken(response, tokenAccess, tokenRefresh);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().result(refreshTokenResponse).build();
        return apiResponse;
    }


    @PutMapping("/updateInfo")
    public ApiResponse<UserResponse> updateInfoUser(
            Authentication authentication,
            @Validated(UserUpdateInfo.class) @RequestBody UserRequestUpdate request) {
        log.error("request"+request);
        String id = authentication.getPrincipal().toString();
        var response = userService.updateInfoUser(id, request);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(response).build();
        return apiResponse;
    }

    @PutMapping("/updatePassword")
    public ApiResponse<UserResponse> updatePassword(
            Authentication authentication,
            @Validated(UserUpdatePassword.class) @RequestBody UserRequestUpdate request) {
        String id = authentication.getPrincipal().toString();
        var response = userService.updateInfoUser(id, request);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(response).build();
        return apiResponse;
    }

    @PutMapping("/uploadAvatarUser")
    public ApiResponse<UserResponse> uploadAvatarUser(
            Authentication authentication,
            @RequestParam("avatar") MultipartFile avatarFile) {
//        log.error("avatarFile"+avatarFile);
        FileUploadUtil.assertAllowed(avatarFile); // kiểm tra xem file hợp lệ ko
        String id = authentication.getPrincipal().toString();
        var response = userService.uploadAvatarUser(id, avatarFile);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder().result(response).build();
        return apiResponse;
    }
}
