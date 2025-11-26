package com.coladz2812.trello_api.service;

import brevo.ApiException;
import brevoApi.TransactionalEmailsApi;
import brevoModel.SendSmtpEmail;
import brevoModel.SendSmtpEmailSender;
import brevoModel.SendSmtpEmailTo;
import com.coladz2812.trello_api.dto.request.EmailRequest;
import com.coladz2812.trello_api.dto.response.EmailResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class EmailService {
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String username;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    // Khi bạn gọi emailService.sendEmail(...), Spring sẽ đẩy method này chạy trên một thread khác (trong TaskExecutor)
    // thay vì block ở thread chính của request.
    // Nghĩa là controller/service của bạn sẽ tiếp tục chạy → trả về UserResponse cho client mà không đợi quá trình gửi
    // email hoàn tất.
    //Email sẽ được gửi song song, nếu có lỗi thì nó sẽ được log lại (hoặc bạn có thể handle bằng @Async + CompletableFuture
    // để bắt kết quả).
    @Async
    public void sendEmail(EmailRequest request) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            // Tham số trong MimeMessageHelper
            //  - new MimeMessageHelper(message, true, "UTF-8");
            //  - message: đối tượng email gốc (MimeMessage).
            //  - true: cho phép email có nhiều phần (multipart) → cần khi gửi file đính kèm,
            //  inline image. Nếu bạn chỉ gửi HTML thuần, có thể để false.
            //  - "UTF-8": để email hiển thị đúng tiếng Việt, emoji, ký tự đặc biệt.
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(username); // hoặc username
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());

            // ⚡ true = cho phép HTML
            helper.setText(request.getContent(), true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.SEND_EMAIL_FAILED);
        }

    }
}
