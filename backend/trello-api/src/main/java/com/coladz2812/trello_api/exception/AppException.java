package com.coladz2812.trello_api.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

public class AppException extends RuntimeException{
    ErrorCode errorCode ;
    public  AppException(ErrorCode errorCode){
        super(errorCode.getMessageCode());
        this.errorCode = errorCode ;
    }
    public ErrorCode getError(){
        return errorCode;
    }
}
