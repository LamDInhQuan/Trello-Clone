package com.coladz2812.trello_api.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyTokenResponse { // cung cấp thông tin và xác thực đối tượng token

    boolean valid;
}
