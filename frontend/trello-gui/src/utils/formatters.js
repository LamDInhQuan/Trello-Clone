export const uppercaseFirstLetter = (value) => { // viết hoa chữ cái đầu 
    if(!value) return 
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}
export const generatePlaceHolderCard = (column) => { // trả về obj PlaceHolderCard 
    return {
        _id : `${column}-placeholder-card`,
        boardId : column.boardId ,
        columnId : column.columnId ,
        FE_PlaceHolderCard : true 
    }
}