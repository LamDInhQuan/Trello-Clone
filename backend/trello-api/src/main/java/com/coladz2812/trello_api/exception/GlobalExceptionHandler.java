package com.coladz2812.trello_api.exception;

import com.coladz2812.trello_api.dto.request.RequestContext;
import com.coladz2812.trello_api.dto.request.StudentRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.mongodb.MongoSocketWriteException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    final String min = "min";
    final String max = "max";
    String messageCheckCountCharacters = "";
    private final RequestContext requestContext;

    // xử lí exception @Valid
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("bắt exception valid ");
        String error = ex.getFieldError().getDefaultMessage(); // "BOARD_NOT_FOUND"
        log.error("error :  " + error);
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(error);
        } catch (IllegalArgumentException e) {
            log.error("bắt lỗi invailid ");
        }

        // dùng ConstraintViolation lấy các thông tin @Valid '
//        Map<String, Object> arguments;
//        var constrainvalidator = ex.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
//        arguments = constrainvalidator.getConstraintDescriptor().getAttributes();
        // lấy field lỗi
        String fieldError = ex.getBindingResult().getFieldError().getField().toString();
        // log.error("field err : "+ex.getBindingResult().getFieldError().getField().toString());
        ApiResponse<Object> apiResponse = ApiResponse.builder().
                code(errorCode.getCode()).
                message(validateSizeConstraints(fieldError) == true ? errorCode.getMessageCode() + " , " + messageCheckCountCharacters : errorCode.getMessageCode()).
                build();
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }

    public boolean validateSizeConstraints(String fieldError) {
        boolean check = false;
        Object requestObject = requestContext.getRequestContext();
        log.error("obj : " + requestObject);
        Class<?> objectClass = requestObject.getClass(); // eps kiểu requestcontext sang class
        for (Field field : objectClass.getDeclaredFields()) {
            // log.error("validateSizeConstraints : "+field.getName().toString());
            if (field.isAnnotationPresent(Size.class) && field.getName().toString().equals(fieldError)) { // xử lí các field @Size

                try {
                    field.setAccessible(true); // truy cập field private
                    Object value = field.get(requestObject); // ✅ truyền đúng object
                    // log.error("Field: " + field.getName() + ", Value: " + value);
                    Size size = field.getAnnotation(Size.class); // lấy size từ field
                    int temp = value.toString().length();
                    if (size.min() > temp) {
                        check = true;
                        messageCheckCountCharacters = String.format("%s cần tối thiểu %d kí tự nữa ! ", fieldError, -(temp - size.min()));
                        break;
                    } else if (size.max() < temp) {
                        check = true;
                        messageCheckCountCharacters = String.format("%s cần bớt đi %d kí tự nữa ! ", fieldError, temp - size.max());
                        break;
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Không truy cập được vào field ");
                }
            }
        }
        return check;
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse> handlingAppException(AppException ex) {
        ApiResponse apiResponse = ApiResponse.builder().
                code(ex.getError().getCode()).
                message(ex.getErrorCode().getMessageCode()).build();
        return ResponseEntity.status(ex.getErrorCode().getHttpStatusCode()).body(apiResponse);
    }
}