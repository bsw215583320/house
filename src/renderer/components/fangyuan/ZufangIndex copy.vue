<template>
 <a-card :bordered="false">
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" @keyup.enter.native="searchQuery">
      <a-row :gutter="24">
       
        <a-col :md="12" :sm="16" :xs="24">
              <a-form-item label="价格">
                <a-input placeholder="请输入最小值" class="query-group-cust" v-model="queryParam.price_begin"></a-input>
                <span class="query-group-split-cust"></span>
                <a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.price_end"></a-input>
              </a-form-item>
            </a-col>
         
          <template v-if="toggleSearchStatus">
               <a-col :md="12" :sm="16" :xs="24">
            <a-form-item label="面积">
              <a-input placeholder="请输入最小值" class="query-group-cust" v-model="queryParam.area_begin"></a-input>
              <span class="query-group-split-cust"></span>
              <a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.area_end"></a-input>
            </a-form-item>
          </a-col>
             <a-col :md="6" :sm="8" :xs="24">
            <a-form-item label="地址">
              <a-input placeholder="请输入地址" v-model="queryParam.adress"></a-input>
            </a-form-item>
          </a-col>
         
            <a-col :md="6" :sm="8" :xs="24">
              <a-form-item label="楼号">
                <a-input placeholder="请输入楼号" v-model="queryParam.building"></a-input>
              </a-form-item>
            </a-col>
           
           
           
             <a-col :md="6" :sm="8" :xs="24">
              <a-form-item label="楼层">
                <a-input placeholder="请输入楼层" v-model="queryParam.floor"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" :xs="24">
              <a-form-item label="是否租出">
                <!-- <a-input placeholder="请输入是否租出" v-model="queryParam.sold"></a-input> -->
                <a-radio-group name="sold" @change="onChange" defaultValue="0" v-model="queryParam.sold">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                    
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" :xs="24">
              <a-form-item label="电压">
                <a-input placeholder="请输入电压" v-model="queryParam.voltage"></a-input>
              </a-form-item>
            </a-col>
             <!-- <a-col :md="12" :sm="16" :xs="24">
              <a-form-item label="电压">
                <a-input placeholder="请输入最小值" class="query-group-cust" v-model="queryParam.voltage_begin"></a-input>
                <span class="query-group-split-cust"></span>
                <a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.voltage_end"></a-input>
              </a-form-item>
            </a-col> -->
          </template>
          <a-col :md="8" :sm="12" :xs="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

      </a-row>
    </a-form>
   
  </div>
 <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
     
    </div>

    <!-- table区域-begin -->
    <div>
     

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        
        :scroll="tableScroll"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="图片不存在" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定修改租出状态吗?" @confirm="() => handleSold(record.id)">
                  <a>已租出</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <template slot='sold' slot-scope="text">
  <a-tag v-if='text=="1"' color="orange">已租</a-tag>
  <a-tag v-if="text=='0'" color="green">未租</a-tag>
</template>

      </a-table>
    </div>

    <house-modal ref="modalForm" @ok="modalFormOk"></house-modal>


 </a-card>
</template>
<script>
import HouseModal from './modules/HouseModal'
export default {
      components: {
      HouseModal,
    },
  data() {
    return {
     queryParam: {

        sold:"0",
         adress:'',
         building:'',
         floor:'',
         voltage:'',
     },
      /* 数据源 */
      dataSource:[],
      /* 分页参数 */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading:false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus:false,
      /* 高级查询条件生效状态 */
      superQueryFlag:false,
      /* 高级查询条件 */
      superQueryParams:"",
      isorter:{
          column:"create_time",
          order:"desc"

      },
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            fixed:'left',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'编号',
            align:"center",
      
            dataIndex: 'code'
          },
          {
            title:'地址',
            align:"center",
            dataIndex: 'adress'
          },
          {
            title:'房东',
            align:"center",
            dataIndex: 'landlord'
          },
          {
            title:'电话',
            align:"center",
            dataIndex: 'tel'
          },
          {
            title:'面积',
            align:"center",
            dataIndex: 'area',
            customRender:function (t,r,index) {
               return t +' '+ r.area_unit;
             }
          },
        //   {
        //     title:'面积单位',
        //     align:"center",
        //     dataIndex: 'area_unit'
        //   },
          {
            title:'楼号',
            align:"center",
            dataIndex: 'building'
          },
          {
            title:'楼层',
            align:"center",
            dataIndex: 'floor'
          },
          {
            title:'价格',
            align:"center",
            dataIndex: 'price',
            customRender:function (t,r,index) {
               return t +' '+ r.price_unit;
             }
          },
        //   {
        //     title:'价格单位',
        //     align:"center",
        //     dataIndex: 'price_unit'
        //   },
          {
            title:'电压',
            align:"center",
            dataIndex: 'voltage'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remark'
          },
          {
            title:'信息来源',
            align:"center",
            dataIndex: 'source'
          },
          {
            title:'登记日期',
            align:"center",
            dataIndex: 'source_time',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'是否租出',
            align:"center",
            dataIndex: 'sold',
            scopedSlots:{customRender:'sold'}
          },
          {
            title:'租出日期',
            align:"center",
            dataIndex: 'sell_time',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/house/house/list",
          delete: "/house/house/delete",
          deleteBatch: "/house/house/deleteBatch",
          exportXlsUrl: "/house/house/exportXls",
          importExcelUrl: "house/house/importExcel",
        },
        dictOptions:{
        },
        tableScroll:{x :13*147+50}
      }
    },
    created(){
        this.loadData();
        this.queryParam.sold = '0';
    },
    
    methods: {
  
    loadData(arg) {
      
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var searchParams = this.getQueryParams();//查询条件
      console.log(searchParams);
      this.loading = true;
      

      let whereSQL = `WHERE 1=1 and sold='${searchParams.sold}' `;
      searchParams.adress !== undefined ? whereSQL += ` and adress LIKE '%${searchParams.adress}%'` : null;
      searchParams.building !== undefined ? whereSQL += `  AND building LIKE '%${searchParams.building}%'` : null;
      searchParams.floor !== undefined ? whereSQL += `  and floor like '%${searchParams.floor}%' ` : null;
      searchParams.voltage !== undefined ? whereSQL += ` and voltage like '%${searchParams.voltage}%' ` : null;
      searchParams.price_begin !== undefined ? whereSQL += `AND price >= ${searchParams.price_begin} ` : null;
      searchParams.price_end !== undefined ? whereSQL += `AND price <= ${searchParams.price_end} ` : null;
      searchParams.area_begin !== undefined ? whereSQL += `AND area >= ${searchParams.area_begin} ` : null;
      searchParams.area_end !== undefined ? whereSQL += `AND area <= ${searchParams.area_end} ` : null;

      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${(searchParams.pageNo - 1) * searchParams.pageSize} `;
      const orderSQL = `ORDER BY id ,${searchParams.column} `;
      // 导出sql
      this.downloadExcelSQL = 'SELECT * from HOUSE ' + whereSQL + orderSQL;
      const rowSQL = this.downloadExcelSQL + pageSQL;
      const countSQL = 'SELECT COUNT(id) AS totalCount from HOUSE ' + whereSQL;
      this.$logger(rowSQL);
      this.$db.all(rowSQL, (err, res) => {
          console.log(res);
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          if (!res.length && searchParams.pageNo !== 1) {
            // 该页没数据，又不是第一页，就往上一页翻
            this.loadData(1);
          } else {
            this.dataSource = res;
          }
        }
        this.loading = false;
      });
      this.$logger(countSQL);
      this.$db.get(countSQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          this.ipagination.total = res.totalCount;
        }
      });





    },
    initDictConfig(){
      console.log("--这是一个假的方法!")
    },
    handleSuperQuery(arg) {
      //高级查询方法
      if(!arg){
        this.superQueryParams=''
        this.superQueryFlag = false
      }else{
        this.superQueryFlag = true
        this.superQueryParams=JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return this.filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },
    filterObj(obj) {
        if (!(typeof obj == 'object')) {
            return;
        }

        for ( var key in obj) {
            if (obj.hasOwnProperty(key)
            && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
            delete obj[key];
            }
        }
        return obj;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery() {
      this.loadData(1);
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
   onChange(e) {
        this.queryParam.sold = e.target.value;
      },
    handleDelete: function (id) {
      this.$db.run(`delete from HOUSE where id = ${id}`,err=>{
          if(err){
            this.$logger(err);
            this.$db.run('ROLLBACK');
            this.$Notice.error({
              title: '删除失败',
              desc: err,
            });
          }
          this.loadData();
      })
    },
    handleSold: function(id){
        this.$db.run(`update HOUSE set sold='1',sell_time = datetime('now') where id = ${id}`,err=>{
            if(err){
                this.$logger(err);
                this.$Notice.error({
                    title:'修改失败',
                    desc:err,
                })
            }
            this.loadData();
        })
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
    },
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="详情";
      this.$refs.modalForm.disableSubmit = true;
    },

    
    
   
  }
};
</script>
<style>

.ant-row {
    margin: 10px !important;
}
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

  
/*列表上方操作按钮区域*/
.ant-card-body .table-operator {
  margin-bottom: 18px;
}
/** Button按钮间距 */
.table-operator .ant-btn {
  margin-top: 15px;
  margin-right: 6px
}
/*列表td的padding设置 可以控制列表大小*/
.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

/*列表页面弹出modal*/
.ant-modal-cust-warp {
  height: 100%
}

/*弹出modal Y轴滚动条*/
.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto
}

/*弹出modal 先有content后有body 故滚动条控制在body上*/
.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden
}
/*列表中有图片的加这个样式 参考用户管理*/
.anty-img-wrap {
  height: 25px;
  position: relative;
}
.anty-img-wrap > img {
  max-height: 100%;
}
/*列表中范围查询样式*/
.query-group-cust{width: calc(50% - 10px) !important;}
.query-group-split-cust:before{content:"~";width: 20px;display: inline-block;text-align: center}




</style>