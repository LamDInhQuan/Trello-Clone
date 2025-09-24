package com.coladz2812.trello_api.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class ValueInListValidator implements ConstraintValidator<ValueIn , List<String>> {
    String[] values ;
    @Override
    public void initialize(ValueIn constraintAnnotation) {
        values = constraintAnnotation.values();
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(List<String> value, ConstraintValidatorContext constraintValidatorContext) {
        if(value == null) return false ;
        for(String v : value){
            if(!Arrays.asList(values).contains(v)) {
                return false;
            }
        }
        return true;
    }
}
