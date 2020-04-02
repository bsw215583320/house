<template>
  <a-upload
    name="file"
    :showUploadList="false"
    accept=".xls,.xlsx"
    :beforeUpload="beforeUpload"
    :multiple="false"
    
  >
    <a-button type="primary" icon="import">导入</a-button>
  </a-upload>
  <!-- <input type="file" ref="upload" accept=".xls,.xlsx" @change="handleImportExcel"> -->
</template>

<script>
import XLSX from "xlsx";
import { dbUtils } from "./dbUtils";
export default {
  name: "Excel",
  components: {
    dbUtils
  },
  data() {
    return {
      outputs: []
    };
  },
  methods: {
    beforeUpload(file) {
      //  console.log(file)
      let that = this;
      const files = file;
      if (files.lenght < 1) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$toast("上传文件格式不正确，请上传xls或者xlsx格式的文件");
        return false;
      }
      //   return new Promise(function(resolve,reject){
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, { type: "binary" }); // 读取数据
          const wsname = workbook.SheetNames[0]; // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
          //  that.outputs = [];  // 清空接收数据

            var flag = 0;
          for (let i = 0; i < ws.length; i++) {
             
            let sd = ws[i]; // 对数据自行操作
            var runSql;
            var vsql = dbUtils.getValidateSql(sd.编号);
            this.$db.all(vsql, (err, res) => {
              if (res != undefined && res.length > 0) {
                var id = res[0].id;
                runSql = dbUtils.getUpdateHouseSql(id);
              } else {
                runSql = dbUtils.insertHouseSql;
              }
              this.$db.serialize(() => {
              this.$db.run("BEGIN");
              this.$db.run(
                runSql,
                "",
                "",
                sd.编号,
                sd.地址,
                sd.业主姓名,
                sd.业主电话+"",
                sd.面积最小,
                sd.面积最大,
                sd.面积单位,
                sd.厂房栋数,
                sd.厂房层数,
                sd.价格最低,
                sd.价格最高,
                sd.租金单位,
                sd.配电,
                sd.备注,
                sd.信息,
                sd.委托,
                dbUtils.getDateByStr(sd.登记日期),
                "0",
                '',
                err => {
                    ++flag;
                    if(flag>=ws.length){
                         this.$emit('ok')
                    }
                  if (err) {
                    that.$logger(err);
                    this.$db.run("ROLLBACK");
                    return false;
                  }
                }
              );
              this.$db.run("COMMIT");
            });
            });
            
          }

         
          //resolve(ws);
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsBinaryString(files);
      
      return false;
    },
   
  }
};
</script>

<style></style>
