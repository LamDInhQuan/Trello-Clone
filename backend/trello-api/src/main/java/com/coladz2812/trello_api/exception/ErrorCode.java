package com.coladz2812.trello_api.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    STUDENT_NAME_CHARACTER(1001,"Tên người dùng phải từ 3 - 20 kí tự ",HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_BLANK(1002,"Địa chỉ không được để trống ",HttpStatus.BAD_REQUEST) ,
    STUDENT_NOT_FOUND(1003,"Không tìm thấy studen bằng id ",HttpStatus.NOT_FOUND),
    INVALID_KEY(9998,"Từ khóa ENUM không hợp lệ ",HttpStatus.BAD_REQUEST),
    NOT_CONNECTED_MONGODB(9999,"Không có kết nối đến cơ sở dữ liệu MongoDB",HttpStatus.INTERNAL_SERVER_ERROR),
    BOARD_TITLE_CHARACTER(1004,"Tiêu đề bảng phải từ 3 - 50 kí tự ",HttpStatus.BAD_REQUEST),
    BOARD_SLUG_CHARACTER(1005,"Slug của bảng không ít hơn 3 kí tự ",HttpStatus.BAD_REQUEST),
    BOARD_DESCRIPTION_CHARACTER(1006,"Mô tả của bảng phải từ 3 - 250 kí tự ",HttpStatus.BAD_REQUEST),
    BOARD_NOT_FOUND(1007,"Không tìm thấy board bằng id ",HttpStatus.NOT_FOUND),
    SCOPE_ERROR(1008,"Phạm vi truy cập phải là public/private ",HttpStatus.BAD_REQUEST) ,
    COLUMN_TITLE_CHARACTER(1009,"Tiêu đề column phải từ 3 - 50 kí tự ",HttpStatus.BAD_REQUEST),
    COLUMN_NOT_FOUND(1010,"Không tìm thấy column bằng id ",HttpStatus.NOT_FOUND),
    CARD_TITLE_CHARACTER(1011,"Tiêu đề card phải từ 3 - 50 kí tự ",HttpStatus.BAD_REQUEST),
    CARD_DESCRIPTION_CHARACTER(1012,"Mô tả của card phải từ 3 - 250 kí tự ",HttpStatus.BAD_REQUEST),
    CARD_NOT_FOUND(1013,"Không tìm thấy card bằng id ",HttpStatus.NOT_FOUND),
    ;


    private int code ;
    private String messageCode ;
    private HttpStatus httpStatusCode ;

    ErrorCode(int code, String messageCode, HttpStatus httpStatusCode) {
        this.code = code;
        this.messageCode = messageCode;
        this.httpStatusCode = httpStatusCode;
    }
}
