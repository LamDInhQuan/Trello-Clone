export const uppercaseFirstLetter = (value) => { // viết hoa chữ cái đầu 
    if(!value) return 
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}
export const generatePlaceHolderCard = (column) => { // trả về obj PlaceHolderCard 
    return {
        _id : `${column._id}-placeholder-card`,
        boardId : column.boardId ,
        columnId : column._id ,
        FE_PlaceHolderCard : true 
    }
}