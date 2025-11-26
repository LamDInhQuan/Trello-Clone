package com.coladz2812.trello_api.configuration;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
public class CloudinaryConfig {
    // @Value chỉ inject giá trị vào field sau khi Spring khởi tạo bean, không thông qua constructor
    @Value("${cloudinary.cloudName}")
    private String cloudName;

    @Value("${cloudinary.cloudApiKey}")
    private String cloudApiKey;

    @Value("${cloudinary.cloudApiSecret}")
    private String cloudApiSecret;

    @Bean
    public Cloudinary cloudinary(){
        final Map<String,String> config = new HashMap<>();
        config.put("cloud_name",cloudName);
        config.put("api_key",cloudApiKey);
        config.put("api_secret",cloudApiSecret);
        return new Cloudinary(config);
    }
}
