
export const getDateByStr = (str)=>{
    if(str&&str!=null){
        str = str.replace(/\./g, '/');
        var date = new Date(str);

        return this.dateToString(date);
    }
    return '';

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
