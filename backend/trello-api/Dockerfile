FROM openjdk:21
  # Nói với Docker: image này sẽ dựa trên image OpenJDK 17 chính thức (có sẵn Java 17).
  # Đây là "nền" để chạy app Spring Boot (vì Spring Boot cần JVM).

ARG FILE_JAR=target/trello-api-0.0.1-SNAPSHOT.jar
    # Định nghĩa một biến build-time trong Dockerfile, tên là FILE_JAR.
    # Mặc định nó trỏ tới file .jar mà Maven build ra ở thư mục target/.
    # Dấu * để bắt tất cả .jar (ví dụ trello-api-0.0.1-SNAPSHOT.jar).

COPY  ${FILE_JAR} trello-api.jar
    # Copy file .jar từ máy host (nơi bạn chạy docker build) vào trong image Docker.
    # trello-api.jar là tên file mới bên trong container.

ENTRYPOINT ["java","-jar","trello-api.jar"]
    # Khi container chạy, nó sẽ thực thi lệnh này.
    #Tức là: chạy app Spring Boot từ file .jar đã copy vào container.

EXPOSE 8017
    # Thông báo cho Docker biết container sẽ mở port 8017.
    # Đây chỉ là metadata, bạn vẫn phải map port khi chạy container: docker run -p 8017:8017 trello-api