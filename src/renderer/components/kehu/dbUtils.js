var customerDbUtils = {


    // 插入
    insertCustomerSql: `insert into 
            CUSTOMER(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,NAME,BUSINESS,TEL,AREA_MIN,AREA_MAX,
            AREA_UNIT,SITE,FLOOR,PRICE_MIN,PRICE_MAX,PRICE_UNIT,REMARK,SOURCE,SOURCE_TIME,
            LOSE,LOSE_TIME) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,'0',?)`,

    // 更新
    getUpdateCustomerSql(arg) {
        return `update CUSTOMER set update_by=?,update_time=?,code=?,name=?,business=?,
                    TEL=?,AREA_MIN=?,AREA_MAX=?,AREA_UNIT=?,SITE=?,FLOOR=?,PRICE_MIN=?,PRICE_MAX=?,
                    PRICE_UNIT=?,REMARK=?,
                    SOURCE=?,SOURCE_TIME=?,LOSE_TIME=? where id = ${arg}`
    },
    // 验重  -编号
    getValidateSql(arg) {
        return `select * from CUSTOMER where code = '${arg}'`
    },

    // 组合条件查询
    getWhereSql(searchParams) {
        let whereSQL = `WHERE 1=1 and lose='${searchParams.lose}' `;
        // 客户名称模糊查询
        searchParams.name !== undefined ? whereSQL  += ` and name like '%${searchParams.name}%'` : null;
        // 位置模糊查询
        searchParams.site !== undefined ? whereSQL += ` and site LIKE '%${searchParams.site}%'` : null;
        // 楼层模糊查询
        searchParams.floor !== undefined ? whereSQL += `  and floor like '%${searchParams.floor}%' ` : null;
        // 行业模糊查询
        searchParams.business !== undefined ? whereSQL += ` and business like '%${searchParams.business}%' ` : null;
        // 价格范围查询
        searchParams.price_begin !== undefined ? whereSQL += `AND (price_min >= ${searchParams.price_begin} 
        or (price_min <= ${searchParams.price_begin} and price_max >= ${searchParams.price_begin})) ` : null;
        searchParams.price_end !== undefined ? whereSQL += `AND (price_min <= ${searchParams.price_end} 
        or (price_max >= ${searchParams.price_end} and price_min <= ${searchParams.price_end})) ` : null;
        // 面积范围查询
        searchParams.area_begin !== undefined ? whereSQL += `AND (area_min >= ${searchParams.area_begin} 
        or (area_min <= ${searchParams.area_begin} and area_max >= ${searchParams.area_begin}))` : null;
        searchParams.area_end !== undefined ? whereSQL += `AND (area_min <= ${searchParams.area_end} 
        or (area_max >= ${searchParams.area_end} and area_min <= ${searchParams.area_end}))` : null;
        // 关键字模糊查询
        searchParams.keyWord !== undefined ? whereSQL += `and (name like '%${searchParams.keyWord}%'
        or site like '%${searchParams.keyWord}%' or business like '%${searchParams.keyWord}%'
        or remark like '%${searchParams.keyWord}%'
        or source like '%${searchParams.keyWord}%'
        or area_unit like '%${searchParams.keyWord}%' or price_unit like '%${searchParams.keyWord}%'` : null;

        return whereSQL;
    },
    // 匹配客户组合条件查询
    getMatchWhereSql(searchParams) {
        let whereSQL = `WHERE 1=1 and lose='${searchParams.lose}' `;
        // 客户名称模糊查询
        searchParams.name !== undefined && searchParams.name != ''? whereSQL  += ` and name like '%${searchParams.name}%'` : null;
        // 位置模糊查询
        searchParams.site !== undefined && searchParams.site != ''? whereSQL += ` and site LIKE '%${searchParams.site}%'` : null;
        // 楼层模糊查询
        searchParams.floor !== undefined && searchParams.floor != ''? whereSQL += `  and floor like '%${searchParams.floor}%' ` : null;
        // 行业模糊查询
        searchParams.business !== undefined && searchParams.business != ''? whereSQL += ` and business like '%${searchParams.business}%' ` : null;
        // 价格范围查询
        searchParams.price_begin !== undefined && searchParams.price_begin != '' && searchParams.price_begin != null ?
            searchParams.price_end == undefined || searchParams.price_end == '' || searchParams.price_begin == null?
            whereSQL += `AND (price_min = ${searchParams.price_begin} 
        or (price_min <= ${searchParams.price_begin} and price_max >= ${searchParams.price_begin}) or price_min is null or price_min = '') ` :
            whereSQL += `AND (price_min is null or price_min = ''  
        or (price_min >= ${searchParams.price_begin} and price_mim <= ${searchParams.price_end}) 
        or (price_min <= ${searchParams.price_begin} and price_max >= ${searchParams.price_begin}) 
        or (price_min >= ${searchParams.price_begin} and price_max <= ${searchParams.price_end})
        or (price_min <= ${searchParams.price_end} and price_max >= ${searchParams.price_end})) ` : null;
        // 面积范围查询
        searchParams.area_begin !== undefined ?
            searchParams.area_end == undefined ?
                whereSQL += `AND (area_min = ${searchParams.area_begin} 
        or (area_min <= ${searchParams.area_begin} and area_max >= ${searchParams.area_begin}))` :
                whereSQL += ` AND ((area_min >= ${searchParams.area_begin} and area_min <= ${searchParams.area_end})
        or (area_min <= ${searchParams.area_begin} and area_max >= ${searchParams.area_begin}) 
        or (area_min >= ${searchParams.area_begin} and area_max <= ${searchParams.area_end}) 
        or (area_min <= ${searchParams.area_end} and area_max >= ${searchParams.area_end}))` : null;
        // 关键字模糊查询
        searchParams.keyWord !== undefined ? whereSQL += `and (name like '%${searchParams.keyWord}%'
        or site like '%${searchParams.keyWord}%' or business like '%${searchParams.keyWord}%'
        or remark like '%${searchParams.keyWord}%'
        or source like '%${searchParams.keyWord}%'
        or area_unit like '%${searchParams.keyWord}%' or price_unit like '%${searchParams.keyWord}%'` : null;

        return whereSQL;
    },

    // 分页查询
    getRowSql(searchParams) {
        const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageNo - 1) * searchParams.pageSize} `;
        const orderSQL = searchParams.column !== undefined ? `ORDER BY  ${searchParams.column}  ${searchParams.order} ` : null;
        // 导出sql
        this.downloadExcelSQL = 'SELECT * from CUSTOMER ' + this.getWhereSql(searchParams) + orderSQL;
        const rowSQL = this.downloadExcelSQL + pageSQL;
        return rowSQL;
    },

    // 分页总条数
    getCountSql(searchParams) {
        const countSQL = 'SELECT COUNT(id) AS totalCount from CUSTOMER ' + this.getWhereSql(searchParams);
        return countSQL;
    },

    // 根据房源匹配面积和价格合适的客户
    getMatchSql(searchParams,level) {
        const matchSql = `select a.*,'${level}' as level from customer a ` + this.getMatchWhereSql(searchParams);
        return matchSql;
    },

    // 删除
    getDelSql(arg){
        return `delete from CUSTOMER where id = ${arg}`
    },

    // 修改客户为失效状态
    getLoseSql(arg){
        return `update CUSTOMER set lose='1',lose_time = datetime('now') where id = ${arg}`
    }
}

export {customerDbUtils}























