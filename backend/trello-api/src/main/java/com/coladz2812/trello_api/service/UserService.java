package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.EmailRequest;
import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.UserMapper;
import com.coladz2812.trello_api.model.User;
import com.coladz2812.trello_api.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class UserService {


    @NonFinal
    // Record là kiểu đặc biệt để định nghĩa DTO bất biến chỉ với 1 dòng, không cần getter/setter/toString thủ công.
    public record LoginResponse(String token, UserResponse user) {}

    UserRepository userRepository;
    UserMapper userMapper;
    EmailService emailService;
    BCryptPasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signer-key}")
    private String signerKey ;

    @NonFinal
    @Value("${jwt.valid-duration}")
    private long duration ;

    public UserResponse addUser(UserRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(9);
        User user = userMapper.toUser(request);
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        });
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

    public UserResponse verifyAccount(String email , String token ){
        log.error("email "+email);
        // check lỗi không đúng email
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND) ;
        });
        // check lỗi tài khoản email đã được xác thực
        if(user.getIsActive()){
            throw new AppException(ErrorCode.USER_ACCOUNT_ALREADY_ACTIVE) ;
        }
        // check lỗi token không đúng
        if(!token.equals(user.getVerifyToken())){
            throw new AppException(ErrorCode.VERIFY_TOKEN_NOT_VALID) ;
        }

        // update User
        user.setVerifyToken(null);
        user.setIsActive(true);
        user.setUpdateAt(new Date());
        return userMapper.toUserResponse(userRepository.save(user));
    }
    public LoginResponse login(UserRequest request) {
        // check lỗi không đúng email
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND) ;
        });
        // check lỗi tài khoản email chưa được xác thực
        if(!user.getIsActive()){
            throw new AppException(ErrorCode.USER_ACCOUNT_NOT_ACTIVE) ;
        }
        // check lỗi password không đúng
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH) ;
        }

        // đăng nhập thành công thì tạo token
        String token = generateToken(user.getId(),  user.getUsername());
        var userResponse = userMapper.toUserResponse(user);
        var loginResponse = new LoginResponse(token,userResponse);
        return loginResponse ;
    }

    public String generateToken(String id , String username){
        // tạo header
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        // tạo payload
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(id)
                .issuer("coladeptrai")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(duration,ChronoUnit.SECONDS)))
                .claim("username",username)
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        // taọ obj chứa header và payload của JWT
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        // kí xác nhận
        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }
}
