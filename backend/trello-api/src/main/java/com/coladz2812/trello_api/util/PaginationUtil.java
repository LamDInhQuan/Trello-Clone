package com.coladz2812.trello_api.util;

import lombok.experimental.UtilityClass;

@UtilityClass
// @UtilityClass (Lombok):
// Class không thể khởi tạo instance → bạn không thể dùng các biến hoặc phương thức thuộc instance.
// Do đó, mọi biến và phương thức trong utility class phải là static.
public class PaginationUtil {
    public static int countBoardsInPrevPages(Integer currentPage, Integer boardsInPage) { // đếm số lượng board bỏ qua từ trang board hiên tại
        if (currentPage == null || boardsInPage == null) return 0;

        if (currentPage <= 0 || boardsInPage <= 0) return 0;
        return (currentPage - 1) * boardsInPage;
    }
}
