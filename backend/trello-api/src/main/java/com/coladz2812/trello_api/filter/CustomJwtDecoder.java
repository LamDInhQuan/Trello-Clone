package com.coladz2812.trello_api.filter;

import com.coladz2812.trello_api.dto.response.VerifyTokenResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.repository.UserRepository;
import com.coladz2812.trello_api.service.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import org.springframework.security.core.AuthenticationException;
import java.text.ParseException;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {

    private static final Log log = LogFactory.getLog(CustomJwtDecoder.class);
    @NonFinal
    @Value("${jwt.signerKeyAccess}")
    String signKey;

    @NonFinal
    NimbusJwtDecoder nimbusJwtDecoder;

    private UserService userService;
    private UserRepository userRepository;
    public CustomJwtDecoder(@Lazy UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signKey.getBytes(), "HS512");
//        log.error("goi decoder");
        VerifyTokenResponse isValid = null;
        try {
            var verified = userService.verifyTokenAccess(token,true);
            var userId = verified.getJWTClaimsSet().getSubject(); // giả sử payload chứa userId
            log.error("userID"+verified.getJWTClaimsSet().getSubject());
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        } catch (ParseException e) {
//            log.error("vao ParseException");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        } catch (JOSEException e) {
//            log.error("vao JOSEException");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
        return nimbusJwtDecoder.decode(token);
    }
}
