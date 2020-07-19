var houseDbUtils = {


    // 插入语句
    insertHouseSql: `insert into 
            HOUSE(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,ADRESS,LANDLORD,TEL,AREA_MIN,AREA_MAX,AREA_UNIT,BUILDING,FLOOR,PRICE_MIN,PRICE_MAX,PRICE_UNIT,VOLTAGE,REMARK,SOURCE,ENTRUST,SOURCE_TIME,SOLD,SELL_TIME) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0',?)`,

    // 编辑更新语句
    getUpdateHouseSql(arg) {
        return `update HOUSE set update_by=?,update_time=?,code=?,ADRESS=?,LANDLORD=?,
                    TEL=?,AREA_MIN=?,AREA_MAX=?,AREA_UNIT=?,BUILDING=?,FLOOR=?,PRICE_MIN=?,PRICE_MAX=?,
                    PRICE_UNIT=?,VOLTAGE=?,REMARK=?,
                    SOURCE=?,ENTRUST=?,SOURCE_TIME=?,SELL_TIME=? where id = ${arg}`
    },

    // 验重  -编号
    getValidateSql(arg) {
        return `select * from HOUSE where code = '${arg}'`
    },

    // 修改房源为售出状态
    getSoldSql(arg) {
        return `update HOUSE set sold='1',sell_time = datetime('now') where id = ${arg}`
    },

    // 删除
    getDelSql(arg) {
        return `delete from HOUSE where id = ${arg}`
    },

    // 分页查询
    getRowSql(searchParams) {
        const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageNo - 1) * searchParams.pageSize} `;
        const orderSQL = searchParams.column !== undefined ? `ORDER BY  ${searchParams.column}  ${searchParams.order} ` : null;
        // 导出sql
        this.downloadExcelSQL = 'SELECT * from HOUSE ' + this.getWhereSql(searchParams) + orderSQL;
        const rowSQL = this.downloadExcelSQL + pageSQL;
        return rowSQL;
    },

    // 总条数
    getCountSQl(searchParams) {
        const countSQL = 'SELECT COUNT(id) AS totalCount from HOUSE ' + this.getWhereSql(searchParams);
        return countSQL;
    },

    // 条件组合
    getWhereSql(searchParams) {
        let whereSQL = `WHERE 1=1 and sold='${searchParams.sold}' `;
        // 地址模糊查询
        searchParams.adress !== undefined ? whereSQL += ` and adress LIKE '%${searchParams.adress}%'` : null;
        // 栋数模糊查询
        searchParams.building !== undefined ? whereSQL += `  AND building LIKE '%${searchParams.building}%'` : null;
        // 层数模糊查询
        searchParams.floor !== undefined ? whereSQL += `  and floor like '%${searchParams.floor}%' ` : null;
        // 电压模糊查询
        searchParams.voltage !== undefined ? whereSQL += ` and voltage like '%${searchParams.voltage}%' ` : null;
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
        searchParams.keyWord !== undefined ? whereSQL += `and (code like '%${searchParams.keyWord}%' 
        or adress like '%${searchParams.keyWord}%' or landlord like '%${searchParams.keyWord}%' 
        or voltage like '%${searchParams.keyWord}%' or remark like '%${searchParams.keyWord}%' 
        or source like '%${searchParams.keyWord}%' or entrust like '%${searchParams.keyWord}%')
        or area_unit like '%${searchParams.keyWord}%' or price_unit like '%${searchParams.keyWord}%'` : null;
        return whereSQL;
    },

    // 匹配房源条件组合
    getMatchWhereSql(searchParams) {
        let whereSQL = `WHERE 1=1 and sold='${searchParams.sold}' `;
        // 地址模糊查询
        searchParams.adress !== undefined &&searchParams.adress != '' ? whereSQL += ` and adress LIKE '%${searchParams.adress}%'` : null;
        // 栋数模糊查询
        searchParams.building !== undefined &&searchParams.building != '' ? whereSQL += `  AND building LIKE '%${searchParams.building}%'` : null;
        // 层数模糊查询
        searchParams.floor !== undefined &&searchParams.floor != '' ? whereSQL += `  and floor like '%${searchParams.floor}%' ` : null;
        // 电压模糊查询
        searchParams.voltage !== undefined &&searchParams.voltage != '' ? whereSQL += ` and voltage like '%${searchParams.voltage}%' ` : null;
        // 价格范围查询
        searchParams.price_begin !== undefined && searchParams.price_begin != '' && searchParams.price_begin != null ?
            searchParams.price_end == undefined || searchParams.price_end == '' || searchParams.price_begin == null ?
                whereSQL += `AND (price_min = ${searchParams.price_begin} 
        or (price_min <= ${searchParams.price_begin} and price_max >= ${searchParams.price_begin}) or price_min is null or price_min = '') ` :
                whereSQL += `AND (price_min is null  or price_min = ''
        or (price_min >= ${searchParams.price_begin} and price_min <= ${searchParams.price_end}) 
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
        searchParams.keyWord !== undefined ? whereSQL += `and (code like '%${searchParams.keyWord}%' 
        or adress like '%${searchParams.keyWord}%' or landlord like '%${searchParams.keyWord}%' 
        or voltage like '%${searchParams.keyWord}%' or remark like '%${searchParams.keyWord}%' 
        or source like '%${searchParams.keyWord}%' or entrust like '%${searchParams.keyWord}%')
        or area_unit like '%${searchParams.keyWord}%' or price_unit like '%${searchParams.keyWord}%'` : null;
        return whereSQL;
    },
    // 根据客户匹配面积和价格合适的房源
    getMatchSql(searchParams,level) {
        const matchSql = `select a.*,'${level}' as level from house a ` + this.getMatchWhereSql(searchParams);
        return matchSql;
    },
}

export {houseDbUtils}























