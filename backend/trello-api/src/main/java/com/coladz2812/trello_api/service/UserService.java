package com.coladz2812.trello_api.service;

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
    BCryptPasswordEncoder passwordEncoder;

    public UserResponse addUser(UserRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(9);
        User user = userMapper.toUser(request);
        if(userRepository.existsByEmail(user.getEmail())){
            throw new AppException(ErrorCode.EMAIL_EXISTS);
        }
        String userName = request.getEmail().split("@")[0].toString();
        user.setUsername(userName);
        user.setDisplayName(userName);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerifyToken(UUID.randomUUID().toString());
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
