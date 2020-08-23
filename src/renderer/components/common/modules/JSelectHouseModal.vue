<template>
  <a-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    @ok="handleSubmit"
    @cancel="close"
    cancelText="关闭"
    style="margin-top: -70px"
    wrapClassName="ant-modal-cust-warp"
  >
    <a-row :gutter="10" >

      <a-col :md="24" :sm="24">

          关键字:
          <a-input-search
            :style="{width:'150px',marginBottom:'15px'}"
            placeholder="请输入关键字搜索"
            v-model="queryParam.keyWord"
            @search="onSearch"
          ></a-input-search>
          <a-button @click="searchReset(1)" style="margin-left: 20px" icon="redo">重置</a-button>
          <!--列表-->
          <a-table
            ref="table"
            bordered
            :scroll="tableScroll"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            @change="handleTableChange">
            <template slot='sold' slot-scope="text">
              <a-tag v-if='text=="1"' color="orange">已租</a-tag>
              <a-tag v-if="text=='0'" color="green">未租</a-tag>
            </template>
            <template slot='jellipsis' slot-scope="text">
              <j-ellipsis :value="text" :length="20"></j-ellipsis>
            </template>
          </a-table>

      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import JEllipsis from "../../utils/JEllipsis";
import {filterObj} from "../../utils/util";
  import {houseDbUtils} from "../../fangyuan/dbUtils";
import MyModal from "../../common/myModal/index";

  export default {
    name: 'JSelectHouseModal',
    components: {MyModal,houseDbUtils,filterObj,JEllipsis},
    props: ['modalWidth', 'multi', 'house_id'],
    data() {
      return {
        queryParam: {
          sold: "0",

        },
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
          {
            title: '编号',
            align: "center",
            sorter: true,
            dataIndex: 'code'
          },
          {
            title: '地址',
            align: "center",
            dataIndex: 'adress'
          },
          {
            title: '房东',
            align: "center",
            dataIndex: 'landlord'
          },
          {
            title: '电话',
            align: "center",
            dataIndex: 'tel'
          },
          {
            title: '面积最小',
            align: "center",
            sorter:true,
            dataIndex: 'area_min',
            customRender: function (t, r, index) {
              if (t != null && t != '') {
                return t + ' ' + (r.area_unit == null ? "" : r.area_unit);
              }

            }
          },
          {
            title: '面积最大',
            align: "center",
            sorter:true,
            dataIndex: 'area_max',
            customRender: function (t, r, index) {
              if (t != null && t != '') {
                return t + ' ' + (r.area_unit == null ? "" : r.area_unit);
              }

            }
          },
          //   {
          //     title:'面积单位',
          //     align:"center",
          //     dataIndex: 'area_unit'
          //   },
          {
            title: '栋数',
            sorter:true,
            align: "center",
            dataIndex: 'building'
          },
          {
            title: '层数',
            sorter:true,
            align: "center",
            dataIndex: 'floor'
          },
          {
            title: '最低价',
            sorter:true,
            align: "center",
            dataIndex: 'price_min',
            customRender: function (t, r, index) {
              if (t != null && t != '') {
                return t + ' ' + (r.price_unit == null ? "" : r.price_unit);
              }
            }

          },
          {
            title: '最高价',
            sorter:true,
            align: "center",
            dataIndex: 'price_max',
            customRender: function (t, r, index) {
              if (t != null && t != '') {
                return t + ' ' + (r.price_unit == null ? "" : r.price_unit);
              }

            }

          },
          //   {
          //     title:'价格单位',
          //     align:"center",
          //     dataIndex: 'price_unit'
          //   },
          {
            title: '电压',
            sorter:true,
            align: "center",
            dataIndex: 'voltage'
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'remark',
            scopedSlots: {customRender: 'jellipsis'},

          },
          {
            title: '信息来源',
            align: "center",
            dataIndex: 'source'
          },
          {
            title: '委托',
            align: "center",
            dataIndex: 'entrust'
          },
          {
            title: '登记日期',
            sorter:true,
            align: "center",
            dataIndex: 'source_time',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '是否租出',
            align: "center",
            dataIndex: 'sold',
            scopedSlots: {customRender: 'sold'}
          },
          {
            title: '租出日期',
            align: "center",
            sorter:true,
            dataIndex: 'sell_time',
            customRender: function (text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },

        ],


        tableScroll: {x: 13 * 147 + 50},
        scrollTrigger: {},
        dataSource: [],
        selectedRowKeys: [],
        selectHouseRows: [],
        selecthouseIds: [],
        title: '选择房源',
        ipagination: {
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'create_time',
          order: 'desc'
        },

        visible: false,
        form: this.$form.createForm(this)
      }
    },
    computed: {
      // 计算属性的 getter
      getType: function () {
        console.log("multi: ", this.multi);
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
        house_id() {
        this.initHouseCodes()
      }
    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      this.loadData().then((res) => {
        this.initHouseCodes();
      })
    },
    methods: {
      initHouseCodes() {
        let names = ''
        console.log("props houseIds: ", this.house_id)
        if (this.house_id) {
          let currhouseIds = this.house_id
          let houseIdsArr = currhouseIds.split(',');
          for (let item of this.dataSource) {
            if (houseIdsArr.includes(item.id)) {
              names += "," + item.code
            }
          }
          if (names) {
            names = names.substring(1)
          }
          this.$emit("initComp", names)
        }else{

          this.$emit("initComp", "")
        }
      },
      async loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var searchParams = this.getQueryParams();//查询条件
        this.loading = true;

        console.log(searchParams);
        this.$db.all(houseDbUtils.getRowSql(searchParams), (err, res) => {
          if (err) {
            this.$logger(err);
           /* this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });*/
          } else {
            if (!res.length && searchParams.pageNo !== 1) {
              // 该页没数据，又不是第一页，就往上一页翻
              this.loadData(1);
            } else {
              this.dataSource = res;
            }
            this.resetScreenSize();
          }
          this.loading = false;
        });
        this.$db.get(houseDbUtils.getCountSQl(searchParams), (err, res) => {
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
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal() {
        this.visible = true;

        this.loadData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
        that.selectedRowKeys = [];
        that.selecthouseIds = [];

      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectHouseRows();
        console.log(that.selectHouseRows)
        that.$emit('ok', that.selectHouseRows, that.selecthouseIds);
        that.searchReset(0)
        that.close();
      },
      //获取选择房源信息
      getSelectHouseRows(rowId) {
        let dataSource = this.dataSource;
        let house_id = "";
        this.selectHouseRows = [];
        for (let i = 0, len = dataSource.length; i < len; i++) {
          if (this.selectedRowKeys.includes(dataSource[i].id)) {
            this.selectHouseRows.push(dataSource[i]);
              house_id = house_id + "," + dataSource[i].id
          }
        }
        this.selecthouseIds = house_id.substring(1);
      },

      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onSearch() {
        this.loadData(1);
      },


      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  @import "../../../assets/less/common.less";
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>