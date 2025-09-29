package com.coladz2812.trello_api.filter;

import com.coladz2812.trello_api.dto.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.lang.reflect.Type;
import java.util.List;

@Slf4j
@ControllerAdvice
// ChatGPT đã nói:
//  RequestBodyAdviceAdapter là một cơ chế của Spring MVC để can thiệp, xử lý hoặc thay đổi dữ liệu request trước
//  khi Spring chuyển nó thành object Java (trong các method @RequestBody).
//  Nói nôm na: nó giống như một “middleware” trước khi deserialization JSON → object trong controller.
//  ÁP dụng : Chỉ request body @RequestBody , Trước controller, sau deserialize JSON
public class RequestBodyAdvice extends RequestBodyAdviceAdapter {

    private final RequestContext requestContext;

    public RequestBodyAdvice(RequestContext requestContext) {
        this.requestContext = requestContext;
    }

    private List<?> lstDto = List.of(new BoardRequest(),
            new ColumnRequest(), new CardRequest() ,new BoardRequestUpdate(), new UserRequest());

    // supports() là phương thức quyết định xem RequestBodyAdvice (ở đây là
    // lớp RequestBodyAdviceAdapter bạn tạo) có được áp dụng cho một request cụ thể hay không.
    @Override
    public boolean supports(MethodParameter mp, Type targetType,
                            Class<? extends HttpMessageConverter<?>> cnv) {
        // log.error("request advice : "+targetType.getTypeName());
        // log.error("class : "+String.join(",",lstDto.toString()));
        boolean check = lstDto.stream().anyMatch(e -> {
            // anyMatch(predicate) sẽ dừng ngay khi gặp phần tử thỏa mãn, tương tự như break.
            return e.getClass().getTypeName().equals(targetType.getTypeName());
        });
        return check;
    }

    // 1. MethodParameter:  Là đối tượng đại diện cho một tham số trong method controller.
    //      Cho bạn biết method nào đang được gọi và vị trí của tham số đó.
    //      Ví dụ, nếu controller có method addStudent(@RequestBody StudentRequest request)
    //      , thì mp đại diện cho tham số request.
    // 2. Type targetType : Là kiểu của dữ liệu mà Spring chuyển từ JSON,
    //      thường là kiểu generic của tham số.
    //      Nếu bạn viết @RequestBody StudentRequest, thì targetType sẽ là StudentRequest.class.
    //      Những trường hợp phúc tạp hơn như @RequestBody List<StudentRequest>,
    //      thì targetType sẽ là kiểu List<StudentRequest> (có chứa generic).
    // 3. Class<? extends HttpMessageConverter<?>> cnv
    //      Là lớp converter sẽ nhận dữ liệu JSON rồi chuyển thành object Java.
    //      Ví dụ: MappingJackson2HttpMessageConverter.class nếu JSON → object,
    //      StringHttpMessageConverter.class nếu kiểu là String,
    //      ByteArrayHttpMessageConverter.class cho nhị phân.
    //Bạn có thể kiểm tra converter để áp dụng tín hiệu khác nhau nếu cần.


    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage,
                                MethodParameter parameter, Type targetType,
                                Class<? extends HttpMessageConverter<?>> converterType) {


        // set class
        lstDto.stream().anyMatch(e -> {
            if (e.getClass().isInstance(body)) {
                requestContext.setRequestContext(body); // lưu đối tượng
                return true;
            }
            return false;
        });
        //  Class<?> classes = (Class<?>) requestContext.getRequestContext();
        //  log.error("classes : "+classes.getName());
        return body;
    }
}
