package com.coladz2812.trello_api.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    PASSWORD_NOT_MATCH(1001,"Mật khẩu không khớp! Vui lòng nhập lại!",HttpStatus.BAD_REQUEST),
    USER_ACCOUNT_NOT_ACTIVE(1002,"Tài khoản email chưa được kích hoạt! Vui lòng xác thực tài khoản!",HttpStatus.BAD_REQUEST) ,
    USER_EMAIL_NOT_FOUND(1003,"Không tìm thấy email user",HttpStatus.NOT_FOUND),
    USER_ACCOUNT_ALREADY_ACTIVE(9996,"Tài khoản email đã được kích hoạt!",HttpStatus.BAD_REQUEST) ,
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
    CARD_DESCRIPTION_CHARACTER(1012,"Mô tả của card phải từ 3 - 1000 kí tự ",HttpStatus.BAD_REQUEST),
    CARD_NOT_FOUND(1013,"Không tìm thấy card bằng id ",HttpStatus.NOT_FOUND),
    INVALID_OBJECT_ID(9997,"Object ID ko hợp lệ",HttpStatus.FORBIDDEN) ,
    UPDATE_COLUMNORDERIDS_NOT_NULL(1014,"Dữ liệu ColumnOrderIds không được để trống",HttpStatus.BAD_REQUEST) ,
    UPDATE_CARDORDERIDS_NOT_NULL(1015,"Dữ liệu CardOrderIds không được để trống",HttpStatus.BAD_REQUEST) ,
    COLUMNID_NOT_NULL(1016,"ColumnId không được để trống",HttpStatus.BAD_REQUEST),
    CARDID_NOT_NULL(1017,"CardId không được để trống",HttpStatus.BAD_REQUEST),
    REMOVE_COLUMN_FAILED(1018,"Xóa column thất bại",HttpStatus.BAD_REQUEST),
    EMAIL_NOT_NULL(1019,"Email không được để trống",HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_NULL(1020,"Password không được để trống",HttpStatus.BAD_REQUEST),
    EMAIL_NOT_VALID(1021,"Email không hợp lệ",HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_VALID(1022,"Password không hợp lệ",HttpStatus.BAD_REQUEST),
    ROLE_NOT_VALID(1023,"Role không hợp lệ",HttpStatus.BAD_REQUEST) ,
    EMAIL_EXISTS(1024,"Email đã tồn tại ",HttpStatus.BAD_REQUEST),
    SUBJECT_EMAIL_NOT_NULL(1025,"Subject email không được để trống",HttpStatus.BAD_REQUEST) ,
    CONTENT_EMAIL_NOT_NULL(1026,"Content email không được để trống ",HttpStatus.BAD_REQUEST),
    COLUMN_TITLE_NOT_NULL(1027,"Tiêu đề column không được để trống ",HttpStatus.BAD_REQUEST),
    CARD_TITLE_NOT_NULL(1028,"Tiêu đề card không được để trống ",HttpStatus.BAD_REQUEST),
    CARD_DESCRIPTION_NOT_NULL(1029,"Mô tả card không được để trống",HttpStatus.BAD_REQUEST),
    SEND_EMAIL_FAILED(4004,"Gửi email thất bại",HttpStatus.BAD_REQUEST) ,
    VERIFY_ACCOUNT_TOKEN_NOT_VALID(4005,"Token Verify không hợp lệ hoặc sai định dạng !",HttpStatus.BAD_REQUEST),
    TOKEN_IS_EXPIRED(4006,"Token đã hết hạn! Vui lòng refresh token!",HttpStatus.GONE) ,
    DOMAIN_CORS_BLOCK(4007,"Domain này không có quyền truy cập!",HttpStatus.FORBIDDEN) ,
    UNAUTHENTICATED(4444,"Không thể xác thực!",HttpStatus.UNAUTHORIZED) ,
    TOKEN_LOGOUT(4008,"Token đã bị logout!",HttpStatus.BAD_REQUEST),
    COOKIE_NOT_FOUND(4009,"Không tìm thấy cookie!",HttpStatus.BAD_REQUEST) ,
    TOKEN_REFRESH_IS_EXPIRED(4009,"Token Refresh đã hết hạn! Vui lòng đăng nhập lại!",HttpStatus.UNAUTHORIZED),
    CURRENT_PASSWORD_NOT_VALID(1027,"Password hiện tại không đúng",HttpStatus.BAD_REQUEST),
    DISPLAY_NAME_NOT_NULL(1028,"Tên hiển thị không được để trống",HttpStatus.BAD_REQUEST),
    IMAGE_MAX_FILE(4010,"Kích thước ảnh quá lớn",HttpStatus.BAD_REQUEST),
    IMAGE_NOT_VALID(4011,"Thuộc tính file không hợp lệ! Chỉ chấp nhận jpg, jpeg và png",HttpStatus.BAD_REQUEST),
    MAX_FILE(4012,"Kích thước file qúa lớn!",HttpStatus.BAD_REQUEST),
    UPLOAD_AVATAR_FAILED(4013,"Upload avatar thất bại!",HttpStatus.BAD_REQUEST)
    ;
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
