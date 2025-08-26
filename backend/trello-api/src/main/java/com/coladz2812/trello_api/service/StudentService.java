package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.StudentRequest;
import com.coladz2812.trello_api.dto.response.StudentResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.StudentMapper;
import com.coladz2812.trello_api.model.Student;
import com.coladz2812.trello_api.repository.StudentRepository;
import com.github.slugify.Slugify;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class StudentService {
     StudentRepository studentRepository;
     StudentMapper studentMapper;
     Slugify slugify ;


    public StudentResponse addStudent(StudentRequest request){
        Student student = studentMapper.toStudent(request);
        student.setToSlug(slugify.slugify(student.getName()));
        return studentMapper.toStudentResponse(studentRepository.save(student));
    }

    public StudentResponse getStudenById(Integer id){
        Student student = studentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));
        return studentMapper.toStudentResponse(student);
    }
}
