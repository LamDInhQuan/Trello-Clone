package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.StudentRequest;
import com.coladz2812.trello_api.dto.response.StudentResponse;
import com.coladz2812.trello_api.model.Student;
import org.mapstruct.Mapper;

// toXxx()	Chuyển đổi giữa Entity và DTO
@Mapper(componentModel = "spring")
public interface StudentMapper {

    Student toStudent(StudentRequest request);
    StudentResponse toStudentResponse(Student student);
}
