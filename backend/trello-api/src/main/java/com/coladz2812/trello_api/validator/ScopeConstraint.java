package com.coladz2812.trello_api.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ScopeValidator.class) // lớp triển khai logic cho custom annotation
public @interface ScopeConstraint { // custom 1 annotation valid dữ liệu
    String message() default "lỗi ";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
