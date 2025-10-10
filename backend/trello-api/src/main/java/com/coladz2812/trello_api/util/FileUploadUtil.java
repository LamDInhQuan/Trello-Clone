package com.coladz2812.trello_api.util;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import lombok.experimental.UtilityClass;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.multipart.MultipartFile;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@UtilityClass
// @UtilityClass (Lombok):
// Class không thể khởi tạo instance → bạn không thể dùng các biến hoặc phương thức thuộc instance.
// Do đó, mọi biến và phương thức trong utility class phải là static.
public class FileUploadUtil {
    public static final long MAX_FILE_SIZE = 10485760; // byte = 10 MB

    public static final String IMAGE_PATTERN =  "(.+\\.(?i)(jpg|jpeg|png|gif|bmp))$";

    // Định dạng ngày giờ để gắn vào tên file tránh trùng lặp
    //Ví dụ: 20251008103045 = 08/10/2025 10:30:45.
    public static final String DATE_FORMAT = "yyyyMMddHHmmss";

    // Format dùng để tạo tên file cuối cùng : %s đầu tiên → tên gốc hoặc custom name , %s thứ hai → timestamp theo DATE_FORMAT
    // Ví dụ: "avatar_20251008103045"
    public static final String FILE_NAME_FORMAT = "%s_%s";
    private static final Log log = LogFactory.getLog(FileUploadUtil.class);

    // Mục đích: kiểm tra file có đúng định dạng không.
    // Pattern.CASE_INSENSITIVE → không phân biệt chữ hoa/chữ thường.
    public static boolean isAllowedExtension(final String fileName , final String pattern){
        final Matcher matcher = Pattern.compile(pattern,Pattern.CASE_INSENSITIVE).matcher(fileName);
        return matcher.matches();
    }

    // MultipartFile : Đại diện cho file upload từ client (thường là từ form HTML <input type="file">).
    // Spring tự động bind file gửi lên thành MultipartFile trong controller.
    public static void assertAllowed(MultipartFile multipartFile){
        final long size = multipartFile.getSize();
        final String fileName = multipartFile.getOriginalFilename();
        // FilenameUtils : Thuộc thư viện Apache Commons IO (org.apache.commons.io.FilenameUtils).
        // Trả về chuỗi phía sau dấu chấm cuối cùng trong tên file.
        final String extension = FilenameUtils.getExtension(fileName); // truyền định dạng đuôi file
        if(!isAllowedExtension(fileName,IMAGE_PATTERN)) {
            throw new AppException(ErrorCode.IMAGE_NOT_VALID);
        }
        if(size > MAX_FILE_SIZE){
            throw new AppException(ErrorCode.IMAGE_MAX_FILE);
        }
    }

    public static String getFileName(final String fileName){
        // DateFormat : Dùng để chuyển đổi thời gian (timestamp) sang chuỗi theo định dạng DATE_FORMAT
        final DateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        final String date = dateFormat.format(System.currentTimeMillis()); // Lấy thời gian hiện tại (số mili giây từ 1/1/1970)
        return String.format(FILE_NAME_FORMAT,fileName,date); // kết hợp theo kiểu format
    }
}
