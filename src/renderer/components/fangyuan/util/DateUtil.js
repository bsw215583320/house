
export const getDateByStr = (str)=>{
    if(str&&str!=null){
        var date;
        if(isNaN(str)) {
            str = str.replace(/\./g, '/');
            date = new Date(str);
            return dateToString(date);
        } else {
            date = formatDate(str,'-')
            return date;
        }


    }
    return '';

}
export const formatDate = (numb, format) => {
    const time = new Date((numb - 1) * 24 * 3600000 + 1)
    time.setYear(time.getFullYear() - 70)
    const year = time.getFullYear() + ''
    const month = time.getMonth() + 1 + ''
    const date = time.getDate() - 1 + ''
    if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
    }
    return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

export const dateToString = (date) =>{
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
}
