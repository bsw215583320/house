<template>
    <a-card :bordered="false">
        <div id="components-form-demo-advanced-search">
            <a-form class="ant-advanced-search-form" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">

                    <a-col :md="12" :sm="16" :xs="24">
                        <a-form-item label="价格">
                            <a-input placeholder="请输入最小值" class="query-group-cust"
                                     v-model="queryParam.price_begin"></a-input>
                            <span class="query-group-split-cust"></span>
                            <a-input placeholder="请输入最大值" class="query-group-cust"
                                     v-model="queryParam.price_end"></a-input>
                        </a-form-item>
                    </a-col>

                    <template v-if="toggleSearchStatus">
                        <a-col :md="12" :sm="16" :xs="24">
                            <a-form-item label="面积">
                                <a-input placeholder="请输入最小值" class="query-group-cust"
                                         v-model="queryParam.area_begin"></a-input>
                                <span class="query-group-split-cust"></span>
                                <a-input placeholder="请输入最大值" class="query-group-cust"
                                         v-model="queryParam.area_end"></a-input>
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
                                <a-radio-group name="sold" @change="onChange" defaultValue="0"
                                               v-model="queryParam.sold">
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
                        <a-col :md="6" :sm="8" :xs="24">
                            <a-form-item label="关键字">
                                <a-input placeholder="请输入关键字" v-model="queryParam.keyWord"></a-input>
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
            <excel @ok="modalFormOk" @loadStart="loadStart"></excel>
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
                    <img v-else :src="getImgView(text)" height="25px" alt="图片不存在"
                         style="max-width:80px;font-size: 12px;font-style: italic;"/>
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

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
              <a-menu-item>
                <a @click="matchCustomers(record)">匹配客户</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
                <template slot='sold' slot-scope="text">
                    <a-tag v-if='text=="1"' color="orange">已租</a-tag>
                    <a-tag v-if="text=='0'" color="green">未租</a-tag>
                </template>
                <template slot='jellipsis' slot-scope="text">
                    <j-ellipsis :value="text" :length="20"></j-ellipsis>
                </template>
            </a-table>
        </div>

        <house-modal ref="modalForm" @ok="modalFormOk"></house-modal>
        <customer-list-modal ref="customerListModal" ></customer-list-modal>

    </a-card>
</template>
<script>
    import HouseModal from './modules/HouseModal'
    import Excel from './Excel'
    import JEllipsis from "../utils/JEllipsis";
    import { houseDbUtils } from "./dbUtils"
    import CustomerListModal from "./modules/CustomerListModal";



    export default {
        components: {
            HouseModal,
            Excel,
            JEllipsis,
            houseDbUtils,
            CustomerListModal,

        },
        data() {
            return {
                queryParam: {

                    sold: "0",
                    adress: '',
                    building: '',
                    floor: '',
                    voltage: '',
                },
                /* 数据源 */
                dataSource: [],
                /* 分页参数 */
                ipagination: {
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
                /* 筛选参数 */
                filters: {},
                /* table加载状态 */
                loading: false,
                /* table选中keys*/
                selectedRowKeys: [],
                /* table选中records*/
                selectionRows: [],
                /* 查询折叠 */
                toggleSearchStatus: false,
                /* 高级查询条件生效状态 */
                superQueryFlag: false,
                /* 高级查询条件 */
                superQueryParams: "",
                isorter: {
                    column: "create_time",
                    order: "desc"

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
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: "center",
                        fixed: "right",
                        width: 147,
                        scopedSlots: {customRender: 'action'}
                    }
                ],


                tableScroll: {x: 13 * 147 + 50}
            }
        },
        created() {

            this.queryParam.sold = '0';
            this.loadData();
        },

        methods: {

            loadData(arg) {

                //加载数据 若传入参数1则加载第一页的内容
                if (arg === 1) {
                    this.ipagination.current = 1;
                }
                var searchParams = this.getQueryParams();//查询条件
                this.loading = true;

                this.$db.all(houseDbUtils.getRowSql(searchParams), (err, res) => {
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

            handleSuperQuery(arg) {
                //高级查询方法
                if (!arg) {
                    this.superQueryParams = ''
                    this.superQueryFlag = false
                } else {
                    this.superQueryFlag = true
                    this.superQueryParams = JSON.stringify(arg)
                }
                this.loadData()
            },
            getQueryParams() {
                //获取查询条件
                let sqp = {}
                if (this.superQueryParams) {
                    sqp['superQueryParams'] = encodeURI(this.superQueryParams)
                }
                var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
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

                for (var key in obj) {
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
                this.$db.run(houseDbUtils.getDelSql(id), err => {
                    if (err) {
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
            handleSold: function (id) {
                this.$db.run(houseDbUtils.getSoldSql(id), err => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '修改失败',
                            desc: err,
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
            handleToggleSearch() {
                this.toggleSearchStatus = !this.toggleSearchStatus;
            },
            modalFormOk() {
                // 新增/修改 成功时，重载列表
                this.loadData();
            },
            handleDetail: function (record) {
                this.$refs.modalForm.edit(record);
                this.$refs.modalForm.title = "详情";
                this.$refs.modalForm.disableSubmit = true;
            },
            matchCustomers: function (record) {
               this.$refs.customerListModal.visible = true;
                this.$refs.customerListModal.loadData(record);
            },
            loadStart: function(){
                this.loading = true
            }



    }
    };
</script>
<style scoped>
    @import "../../assets/less/common.less";
</style>