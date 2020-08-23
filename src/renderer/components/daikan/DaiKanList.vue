<template>
  <my-modal
          :title="title"
          :width="800"
          :visible.sync="visible"
          :fullscreen.sync=fullscreen
          :switch-fullscreen=switchFullscreen>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd()" type="primary" icon="plus">新增</a-button>

    </div>
    <!-- table区域-begin -->
    <div>


      <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :pagination="ipagination"
              :dataSource="dataSource"
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
                <a-popconfirm title="确定修改有效状态吗?" @confirm="() => handleLose(record.id)">
                  <a>已失效</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <template slot='lose' slot-scope="text">
          <a-tag v-if='text=="1"' color="orange">无效</a-tag>
          <a-tag v-if="text=='0'" color="green">有效</a-tag>
        </template>
        <template slot='level' slot-scope="text">
          <a-tag v-if='text=="1"' color="orange">很高</a-tag>
          <a-tag v-if="text=='2'" color="blue">高</a-tag>
        </template>
        <template slot='jellipsis' slot-scope="text">
          <j-ellipsis :value="text" :length="20"></j-ellipsis>
        </template>
        <template slot='sold' slot-scope="text">
          <a-tag v-if='text=="1"' color="orange">已租</a-tag>
          <a-tag v-if="text=='0'" color="green">未租</a-tag>
        </template>
      </a-table>
    </div>
    <dai-kan-modal ref="modalForm" @ok="modalFormOk"></dai-kan-modal>
  </my-modal>
</template>

<script>
  import JEllipsis from "../utils/JEllipsis";
  import { houseDbUtils } from "../fangyuan/dbUtils"
  import MyModal from "../common/myModal/index";
  import { similar,findSubStr,matchRate,matchSite } from "../fangyuan/util/StringUtil"
  import {customerDbUtils} from "../kehu/dbUtils";
  import {takeLookDbUtils} from "./dbUtils";
  import DaiKanModal from "./modules/DaiKanModal";
  export default {
    name: 'DaiKanList',
    props:{

    },
    components: {MyModal,JEllipsis,houseDbUtils,similar,findSubStr,matchRate,matchSite,takeLookDbUtils,DaiKanModal},
    data() {
      return {
        title:"带看记录",
        fullscreen:true,
        visible: false,
        switchFullscreen:true,
        model: {},
        /* 数据源 */
        dataSource:[],
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        /* table加载状态 */
        loading:false,
        searchParams:[],
        customer_id:"",
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            fixed: 'left',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
      /*    {
            title: '编号',
            align: "center",
            sorter: true,
            dataIndex: 'code'
          },*/
          {
            title: '房源编号',
            align: "center",
            sorter: true,
            dataIndex: 'house_code'
          },
          {
            title: '带看时间',
            align: "center",
            dataIndex: 'take_time',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '评价',
            align: "center",
            dataIndex: 'evaluate'
          },
          {
            title: '要求',
            align: "center",
            dataIndex: 'request'
          },

          {
            title: '备注',
            align: "center",
            dataIndex: 'remark',
            scopedSlots: {customRender: 'jellipsis'},

          },

        ],
        tableScroll:{x :7*147+50},
      }
    },
    computed: {   },
    watch: {   },
    created(){   },
    methods: {
      loadData(arg) {
        this.model = arg;
        this.loading = true;
        let searchParams = {

          'customer_id':arg.id,
          'pageNo':this.ipagination.current,
          'pageSize':this.ipagination.pageSize};
        this.customer_id = arg.id;
        var sql = takeLookDbUtils.getRowSql(searchParams);
        console.log(sql)
        this.$db.all(sql, (err, res) => {
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
      },

      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData(this.model);
      },
      onChange(e) {
        console.log(e)
        this.queryParam.lose = e.target.value;
      },
      handleDelete: function (id) {
        this.$db.run(customerDbUtils.getDelSql(id),err=>{
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

      handleEdit: function (record) {
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.customer_id);
        this.$refs.modalForm.title = "新增";
        this.$refs.modalForm.disableSubmit = false;
      },

      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData(this.model);
      },
      handleDetail:function(record){
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      loadStart: function(){
        this.loading = true
      },
    }
  }
  function sortNumber(a,b) {
    return parseInt(a.level) - parseInt(b.level)
  }
</script>

<style >

  .table-operator {
    margin-bottom: 18px;
  }
</style>