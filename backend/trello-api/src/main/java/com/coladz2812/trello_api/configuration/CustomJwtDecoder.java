package com.coladz2812.trello_api.configuration;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.service.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {

    @NonFinal
    @Value("${jwt.signerKey}")
    String signKey ;

    @NonFinal
    NimbusJwtDecoder nimbusJwtDecoder;

    private   UserService userService ;

    public CustomJwtDecoder(@Lazy UserService userService) {
        this.userService = userService;
    }
    @Override
    public Jwt decode(String token) throws JwtException {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signKey.getBytes(),"HS512");
        try {
            var isValid = userService.verifyToken(token);
            if(!isValid.isValid()){
                 throw new JwtException("Token isValid");
            }
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
        return nimbusJwtDecoder.decode(token);
    }
}
