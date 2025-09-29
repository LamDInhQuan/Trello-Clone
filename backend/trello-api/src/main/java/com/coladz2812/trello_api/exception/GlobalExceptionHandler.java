package com.coladz2812.trello_api.exception;

import com.coladz2812.trello_api.filter.RequestContext;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.lang.reflect.Field;
import java.util.*;

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
    public ResponseEntity<Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        Object target = ex.getBindingResult().getTarget(); // object đã bind xong
        if (target == null) {
            log.error("Target object is null → request body không map được vào DTO");
        } else {
            log.error("Validation failed on object: {}", target);
        }
        if (fieldErrors.size() == 1) {
            log.error(fieldErrors.get(0).getDefaultMessage());
            ErrorCode errorCode;
            try {
                errorCode = ErrorCode.valueOf(fieldErrors.get(0).getDefaultMessage());
            } catch (IllegalArgumentException e) {
                errorCode = ErrorCode.INVALID_KEY;
            }
            String field = fieldErrors.get(0).getField();
            return ResponseEntity.status(errorCode.getHttpStatusCode()).body(ApiResponse.builder()
                    .code(errorCode.getCode())
                    .message(validateSizeConstraints(field)
                            ? errorCode.getMessageCode() + " , " + messageCheckCountCharacters
                            : errorCode.getMessageCode())
                    .build());
        }
        // nhiều hơn 1
        List<ApiResponse<Object>> apiResponses = fieldErrors.stream().map(error -> {
            ErrorCode errorCode;
            try {
                errorCode = ErrorCode.valueOf(error.getDefaultMessage());
            } catch (IllegalArgumentException e) {
                errorCode = ErrorCode.INVALID_KEY;
            }
            String field = error.getField();
            return ApiResponse.builder()
                    .code(errorCode.getCode())
                    .message(validateSizeConstraints(field)
                            ? errorCode.getMessageCode() + " , " + messageCheckCountCharacters
                            : errorCode.getMessageCode())
                    .build();
        }).toList();

        Map<String, Object> body = new HashMap<>();
        body.put("errors", apiResponses);

        return ResponseEntity
                .status(ErrorCode.INVALID_KEY.getHttpStatusCode())
                .body(body);
    }


    // dùng ConstraintViolation lấy các thông tin @Valid '
//        Map<String, Object> arguments;
//        var constrainvalidator = ex.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
//        arguments = constrainvalidator.getConstraintDescriptor().getAttributes();
    // lấy field lỗi


    public boolean validateSizeConstraints(String fieldError) {
        boolean check = false;
        Object requestObject = requestContext.getRequestContext();
        if(requestObject == null){
            return false;
        }
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