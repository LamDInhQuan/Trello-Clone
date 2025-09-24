package com.coladz2812.trello_api.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class ValueInStringValidator implements ConstraintValidator<ValueIn , String> {
    String[] values ;
    @Override
    public void initialize(ValueIn constraintAnnotation) {
        values = constraintAnnotation.values();
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if(value == null) return false ;
            if(!Arrays.asList(values).contains(value)) {
                return false;
            }

        return true;
    }
}
