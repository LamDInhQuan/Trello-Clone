package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.EmailRequest;
import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.UserMapper;
import com.coladz2812.trello_api.model.User;
import com.coladz2812.trello_api.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    EmailService emailService;
    BCryptPasswordEncoder passwordEncoder;


    public UserResponse addUser(UserRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(9);
        User user = userMapper.toUser(request);
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        String userName = request.getEmail().split("@")[0].toString();
        user.setUsername(userName);
        user.setDisplayName(userName);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerifyToken(UUID.randomUUID().toString());
        var userResponse = userRepository.save(user);

        // gửi email
        String verifyLink = "http://localhost:3000/auth/verify?email=" + user.getEmail() + "&token=" + user.getVerifyToken();
        String body = "<p>Xin chào <b>" + user.getUsername() + "</b>,</p>"
                + "<p>Cảm ơn bạn đã đăng ký sử dụng <b>Trello Advance</b>.</p>"
                + "<p>Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn:</p>"
                + "<p><a href=\"" + verifyLink + "\" "
                + "style=\"display:inline-block;padding:10px 20px;"
                + "background-color:#4CAF50;color:white;text-decoration:none;"
                + "border-radius:5px;font-weight:bold;\">Xác thực tài khoản</a></p>"
                + "<br/>"
                + "<p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>";
        EmailRequest emailRequest = new EmailRequest(user.getEmail(), "\"[Trello Advance] Hoàn tất xác thực tài khoản \uD83D\uDE80\";",
                body);

        emailService.sendEmail(emailRequest);
        return userMapper.toUserResponse(userResponse);
    }
}
