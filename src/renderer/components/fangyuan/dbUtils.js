

var dbUtils = {

   
            insertHouseSql : `insert into 
            HOUSE(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,ADRESS,LANDLORD,TEL,AREA_MIN,AREA_MAX,AREA_UNIT,BUILDING,FLOOR,PRICE_MIN,PRICE_MAX,PRICE_UNIT,VOLTAGE,REMARK,SOURCE,ENTRUST,SOURCE_TIME,SOLD,SELL_TIME) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0',?)`,

            getUpdateHouseSql(arg){ 
                return `update HOUSE set update_by=?,update_time=?,code=?,ADRESS=?,LANDLORD=?,
                    TEL=?,AREA_MIN=?,AREA_MAX=?,AREA_UNIT=?,BUILDING=?,FLOOR=?,PRICE_MIN=?,PRICE_MAX=?,
                    PRICE_UNIT=?,VOLTAGE=?,REMARK=?,
                    SOURCE=?,ENTRUST=?,SOURCE_TIME=?,SELL_TIME=? where id = ${arg}`
        },
        getValidateSql(arg){
            return `select * from HOUSE where code = '${arg}'`
        },

       
    }
 
export {dbUtils}























