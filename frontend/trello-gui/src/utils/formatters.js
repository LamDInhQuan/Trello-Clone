export const uppercaseFirstLetter = (value) => {
    // viết hoa chữ cái đầu
    if (!value) return;
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};
export const generatePlaceHolderCard = (column) => {
    // trả về obj PlaceHolderCard
    return {
        _id: `${column._id}-placeholder-card`,
        boardId: column.boardId,
        columnId: column._id,
        FE_PlaceHolderCard: true,
    };
};

// kĩ thuật css pointer-event để chặn user spam click tại bất kì chỗ nào có hành động click gọi api
// Đây là một kĩ thuật hay tận dụng cho Axios Interceptors và CSS Pointer Event để chỉ phải viết
// code xử lí 1 lần cho toàn bộ dự án
// Cách sử dụng  : với tất cả các link hoặc button có hành động gọi api thì thêm class
// "interceptor-loading" cho nó là xong
export const interceptorLoadingElements = (calling) => {
    const elements = document.querySelectorAll('.interceptor-loading');
    for (let i = 0; i < elements.length; i++) {
        if (calling) {
            // Nếu đang trong thời gian gọi api ( calling = true ) thì làm mờ tất cả phần tử và chặn click
            // bằng css pointer-events
            elements[i].style.opacity = '0.5';
            elements[i].style.pointerEvents = 'none';
        } else {
            // Ngược lại thì trả về như ban đầu , không làm gì cả
            elements[i].style.opacity = 'initial';
            elements[i].style.pointerEvents = 'initial';
        }
    }
};
