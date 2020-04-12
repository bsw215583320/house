

var dbUtils = {

   
            insertCustomerSql : `insert into 
            CUSTOMER(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,NAME,BUSINESS,TEL,AREA_MIN,AREA_MAX,
            AREA_UNIT,SITE,FLOOR,PRICE_MIN,PRICE_MAX,PRICE_UNIT,REMARK,SOURCE,SOURCE_TIME,
            LOSE,LOSE_TIME) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,'0',?)`,

            getUpdateCustomerSql(arg){
                return `update CUSTOMER set update_by=?,update_time=?,code=?,name=?,business=?,
                    TEL=?,AREA_MIN=?,AREA_MAX=?,AREA_UNIT=?,SITE=?,FLOOR=?,PRICE_MIN=?,PRICE_MAX=?,
                    PRICE_UNIT=?,REMARK=?,
                    SOURCE=?,SOURCE_TIME=?,LOSE_TIME=? where id = ${arg}`
        },
        getValidateSql(arg){
            return `select * from CUSTOMER where code = '${arg}'`
        },

       
    }
 
export {dbUtils}























