

var dbUtils = {

   
            insertHouseSql : `insert into 
            HOUSE(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,ADRESS,LANDLORD,TEL,AREA_MIN,AREA_MAX,AREA_UNIT,BUILDING,FLOOR,PRICE_MIN,PRICE_MAX,PRICE_UNIT,VOLTAGE,REMARK,SOURCE,ENTRUST,SOURCE_TIME,SOLD,SELL_TIME) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

            getUpdateHouseSql(arg){ 
                return `update HOUSE set update_by=?,update_time=?,code=?,ADRESS=?,LANDLORD=?,
                    TEL=?,AREA_MIN=?,AREA_MAX=?,AREA_UNIT=?,BUILDING=?,FLOOR=?,PRICE_MIN=?,PRICE_MAX=?,PRICE_UNIT=?,VOLTAGE=?,REMARK=?,
                    SOURCE=?,ENTRUST=?,SOURCE_TIME=?,SOLD=?,SELL_TIME=? where id = ${arg}`
        },
        getValidateSql(arg){
            return `select * from HOUSE where code = '${arg}'`
        },
        getDateByStr(str){
            if(str&&str!=null){
                str = str.replace(/\./g, '/');
                var date = new Date(str);
    
                return this.dateToString(date);
            }
            return '';
            
        },
        dateToString(date){ 
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
          },
  
       
    }
 
export {dbUtils}























