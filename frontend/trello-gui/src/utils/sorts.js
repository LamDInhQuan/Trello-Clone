// thuật toán dùng cho mảng nhỏ , ít phần tử
export const mapOrder = (originalArray, orderArray, key) => {
    if (!originalArray || !orderArray || !key) return [];
    const cloneArray = [...originalArray];
    const orderredArray = cloneArray.sort((a, b) => {
        return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]);
    });
    return orderredArray;
};

export const sortByIndex = (arr, fromIndex, toIndex) => {
    const newArr = [...arr];
    const [obj] = newArr.splice(fromIndex, 1); // a , b , c => arr = b , c 
    newArr.splice(toIndex, 0, obj); // ( b , c, a )
    return newArr; // trả về mảng đã được sắp xếp lại
};
