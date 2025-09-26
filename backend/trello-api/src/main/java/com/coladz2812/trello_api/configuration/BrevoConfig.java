package com.coladz2812.trello_api.configuration;

import brevo.ApiClient;
import brevoApi.TransactionalEmailsApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class BrevoConfig {
    @Value("${brevo.api.key}")
    private String apiKey ;
    @Bean
    public TransactionalEmailsApi transactionalEmailsApi(){
        // Lấy ra client mặc định của Brevo để gọi API ,  ApiClient quản lý các thiết lập HTTP, base URL, authentication…
        ApiClient apiClient = new ApiClient();
        // Lấy authentication object dùng kiểu Bearer Token. "api-key" là tên auth mà Brevo SDK định nghĩa trong ApiClient
//        log.error("api key : "+apiKey);
       apiClient.setApiKey(apiKey);
       return new TransactionalEmailsApi(apiClient);
    }
}
