var takeLookDbUtils = {


    // 插入语句
    insertSql: `insert into 
            TAKE_LOOK(ID,CREATE_BY,CREATE_TIME,UPDATE_BY,UPDATE_TIME,CODE,customer_id,house_id,take_time,evaluate,request,REMARK) 
            VALUES(null,'',datetime('now'),?,?, ?,? ,?,?,?,?,?)`,

    // 编辑更新语句
    getUpdateSql(arg) {
        return `update TAKE_LOOK set update_by=?,update_time=?,code=?,customer_id=?,house_id=?,
                    take_time=?,evaluate=?,request=?,REMARK=? 
                     where id = ${arg}`
    },

    // 验重  -编号
    getValidateSql(arg) {
        return `select * from TAKE_LOOK where code = '${arg}'`
    },


    // 删除
    getDelSql(arg) {
        return `delete from TAKE_LOOK where id = ${arg}`
    },

    // 分页查询
    getRowSql(searchParams) {
        const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageNo - 1) * searchParams.pageSize} `;
        const orderSQL = searchParams.column !== undefined ? `ORDER BY  a.${searchParams.column}  ${searchParams.order} ` : "";
        // 导出sql
        this.downloadExcelSQL = 'SELECT a.*,b.code as house_code from TAKE_LOOK a join house b on a.house_id = b.id  ' + this.getWhereSql(searchParams) + orderSQL;
        const rowSQL = this.downloadExcelSQL + pageSQL;
        return rowSQL;
    },

    // 总条数
    getCountSQl(searchParams) {
        const countSQL = 'SELECT COUNT(id) AS totalCount from TAKE_LOOK ' + this.getWhereSql(searchParams);
        return countSQL;
    },

    // 条件组合
    getWhereSql(searchParams) {
        let whereSQL = `WHERE 1=1 `;
        // 地址模糊查询
        searchParams.customer_id !== undefined ? whereSQL += ` and a.customer_id LIKE '%${searchParams.customer_id}%'` : null;
        // 栋数模糊查询
        searchParams.house_id !== undefined ? whereSQL += `  AND a.house_id LIKE '%${searchParams.house_id}%'` : null;
        // 层数模糊查询
        searchParams.take_time !== undefined ? whereSQL += `  and a.take_time like '%${searchParams.take_time}%' ` : null;

        return whereSQL;
    },



}

export {takeLookDbUtils}























