package com.coladz2812.trello_api.service;

import com.cloudinary.Cloudinary;
import com.coladz2812.trello_api.dto.request.EmailRequest;
import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.request.UserRequestUpdate;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.dto.response.VerifyTokenResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.UserMapper;
import com.coladz2812.trello_api.model.InvalidatedToken;
import com.coladz2812.trello_api.model.User;
import com.coladz2812.trello_api.repository.InvalidatedTokenRepository;
import com.coladz2812.trello_api.repository.UserRepository;
import com.coladz2812.trello_api.util.FileUploadUtil;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class UserService {


    @NonFinal
    // Record là kiểu đặc biệt để định nghĩa DTO bất biến chỉ với 1 dòng, không cần getter/setter/toString thủ công.
    public record LoginResponse(String accessToken, String refreshToken, UserResponse user) {
    }


    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    UserMapper userMapper;
    EmailService emailService;
    BCryptPasswordEncoder passwordEncoder;
    Cloudinary cloudinary;

    @NonFinal
    @Value("${jwt.signerKeyAccess}")
    private String signerKeyAccess;

    @NonFinal
    @Value("${jwt.signerKeyRefresh}")
    private String signerKeyRefresh;

    @NonFinal
    @Value("${jwt.valid-duration}")
    private long durationAccess;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    private long durationRefresh;

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

    public UserResponse verifyAccount(String email, String token) {
        log.error("email " + email);
        // check lỗi không đúng email
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // check lỗi tài khoản email đã được xác thực
        if (user.getIsActive()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_ALREADY_ACTIVE);
        }
        // check lỗi token không đúng
        if (!token.equals(user.getVerifyToken())) {
            throw new AppException(ErrorCode.VERIFY_ACCOUNT_TOKEN_NOT_VALID);
        }

        // update User
        user.setVerifyToken(null);
        user.setIsActive(true);
        user.setUpdateAt(new Date());
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public LoginResponse login(UserRequest request, HttpServletResponse response) {
        // check lỗi không đúng email
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // check lỗi tài khoản email chưa được xác thực
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_NOT_ACTIVE);
        }
        // check lỗi password không đúng
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        // đăng nhập thành công thì tạo token
        String accessToken = generateToken(user.getId(), user.getEmail(), signerKeyAccess, durationAccess);
        // thêm token vào cookie
        generateCookie(response, "accessToken", accessToken, 14);

        // cookie refresh token
        String refreshToken = generateToken(user.getId(), user.getEmail(), signerKeyRefresh, durationRefresh);
        generateCookie(response, "refreshToken", refreshToken, 14);
        var userResponse = userMapper.toUserResponse(user);
        var loginResponse = new LoginResponse(accessToken, refreshToken, userResponse);
        return loginResponse;
    }

    public String generateToken(String id, String email, String singerKey, long duration) {
        // tạo header
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        // tạo payload
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(id)
                .issuer("coladeptrai")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(duration, ChronoUnit.SECONDS)))
                .claim("email", email)
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        // taọ obj chứa header và payload của JWT
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        // kí xác nhận
        try {
            jwsObject.sign(new MACSigner(singerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    // tạo 1 cookie
    // Cookie là một mẩu thông tin nhỏ mà server gửi về trình duyệt (client) để lưu trữ trên máy người dùng.
    //  Browser sẽ tự động gửi cookie này về server trong các request tiếp theo tới cùng domain.
    //  Mục đích:
    //  Lưu thông tin đăng nhập (session ID, token, username…)
    //  Lưu trạng thái người dùng (giỏ hàng, lựa chọn hiển thị)
    //  Theo dõi hành vi (analytics, quảng cáo)
    public void generateCookie(HttpServletResponse response, String name, String value, int expireDays) {

        Cookie cookie = new Cookie(name, value);
//        cookie.setSecure(true);
//        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(expireDays * 24 * 60 * 60);   // chuyển ngày sang giâ
        response.addCookie(cookie);
    }

    public void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null); // giá trị null
        cookie.setPath("/");                     // phải trùng path khi tạo cookie
        cookie.setMaxAge(0);                     // maxAge=0 → xóa cookie
        cookie.setSecure(true);                  // nếu cookie gốc có secure
//    cookie.setHttpOnly(true);              // nếu cookie gốc có HttpOnly
        response.addCookie(cookie);
    }

    public VerifyTokenResponse verifyTokenResponse(String token) throws ParseException, JOSEException, JwtException {
        boolean isValid = true;
        try {
            var jwtToken = verifyTokenAccess(token, true);
        } catch (AppException e) {
            isValid = false;
        }
        return new VerifyTokenResponse().builder().valid(isValid).build();
    }

    public SignedJWT verifyTokenAccess(String token, boolean checkExpireTime) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier = new MACVerifier(signerKeyAccess.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token); // parse token thành đối tượng jwt
        Date dateExpire = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean expired = dateExpire.after(new Date()); // lúc hết hạn phải sau lúc gọi verify
        // báo lỗi token hết hạn
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.TOKEN_LOGOUT);
        }
        if (!expired && checkExpireTime) {
            throw new AppException(ErrorCode.TOKEN_IS_EXPIRED);
        }
        boolean verified = signedJWT.verify(jwsVerifier);
        if (!verified) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        // đối tượng xác nhận chữ kí ( nếu chữ kí ko giống thì sai , còn thành phần thay đổi
        // dù không tự tạo token mà vẫn đúng chữ kí thì xác nhận vẫn đúng
        return signedJWT;
    }

    public void logout(HttpServletResponse response, String token) throws ParseException, JOSEException {
//        log.error("Logout");
        // delete cookie
        deleteCookie(response, "accessToken");
        var jwt = verifyTokenAccess(token, false);
        InvalidatedToken invalidatedToken = new InvalidatedToken().builder()
                .id(jwt.getJWTClaimsSet().getJWTID())
                .expiryTime(jwt.getJWTClaimsSet().getExpirationTime()).build();
        invalidatedTokenRepository.save(invalidatedToken);
    }

    public SignedJWT verifyTokenRefresh(String token) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier = new MACVerifier(signerKeyRefresh.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token); // parse token thành đối tượng jwt
        Date dateExpire = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean expired = dateExpire.after(new Date()); // lúc hết hạn phải sau lúc gọi verify
        // báo lỗi token hết hạn
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.TOKEN_LOGOUT);
        }
        if (!expired) {
            throw new AppException(ErrorCode.TOKEN_REFRESH_IS_EXPIRED);
        }
        boolean verified = signedJWT.verify(jwsVerifier);
        if (!verified) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        // đối tượng xác nhận chữ kí ( nếu chữ kí ko giống thì sai , còn thành phần thay đổi
        // dù không tự tạo token mà vẫn đúng chữ kí thì xác nhận vẫn đúng
        return signedJWT;
    }

    public VerifyTokenResponse verifyTokenResponse2(String token) throws ParseException, JOSEException, JwtException {
        boolean isValid = true;
        try {
            var jwtToken = verifyTokenRefresh(token);
        } catch (AppException e) {
            isValid = false;
        }
        return new VerifyTokenResponse().builder().valid(isValid).build();
    }

    public String refreshToken(HttpServletResponse response, String accessToken
            , String refreshToken) throws ParseException, JOSEException {
        var verifyTokenRefresh = verifyTokenRefresh(refreshToken);
        var verifyTokenAccess = verifyTokenAccess(accessToken, false);
        var invalidToken = InvalidatedToken.builder()
                .id(verifyTokenAccess.getJWTClaimsSet().getJWTID())
                .expiryTime(verifyTokenAccess.getJWTClaimsSet().getExpirationTime()).build();
        invalidatedTokenRepository.save(invalidToken);

        String accessTokenJWT = generateToken(verifyTokenAccess.getJWTClaimsSet().getSubject()
                , verifyTokenAccess.getJWTClaimsSet().getStringClaim("email"), signerKeyAccess, durationAccess);
        generateCookie(response, "accessToken", accessTokenJWT, 14);
        return accessTokenJWT;
    }

    public UserResponse updateInfoUser(String id, UserRequestUpdate request) {
        // check lỗi không đúng email
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // check lỗi tài khoản email chưa được xác thực
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_NOT_ACTIVE);
        }
        //        log.error("request : "+request.toString());
        // 1. update info
        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            // check lỗi password không đúng
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.CURRENT_PASSWORD_NOT_VALID);
            }
//            log.error("new getNewPassword() : "+request.getNewPassword());
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        } else if (!request.getDisplayName().isEmpty() && request.getDisplayName() != null) {
//            log.error("new displayname : "+request.getDisplayName());
            user.setDisplayName(request.getDisplayName());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse uploadAvatarUser(String id, MultipartFile avatarFile) {
        // check lỗi không đúng email
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // check lỗi tài khoản email chưa được xác thực
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_NOT_ACTIVE);
        }

        // 2. Update avatar
        if (!avatarFile.isEmpty()) {
//            log.error("avatarFile : "+avatarFile);
            try {
                var uploadResponse = cloudinary.uploader().upload(avatarFile.getBytes(), Map.of("folder", "avatars", // folder trên Cloudinary
                        "public_id", FileUploadUtil.getFileName(avatarFile.getOriginalFilename()), // tên file
                        "overwrite", true,
                        "resource_type", "image"));
//                log.error("uploadResponse"+uploadResponse);
                String avatarURL = uploadResponse.get("secure_url").toString();
                user.setAvatar(avatarURL);
            } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_AVATAR_FAILED);
            }

        }
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
