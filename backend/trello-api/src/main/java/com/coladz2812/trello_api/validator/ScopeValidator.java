package com.coladz2812.trello_api.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ScopeValidator implements ConstraintValidator<ScopeConstraint,String> {

    @Override // khởi tạo lấy giá trị của annotation
    public void initialize(ScopeConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if(s == null) return false ;
        if(s.equals("public") || s.equals("private")) {
            return true;
        }
        return false;
    }
}
