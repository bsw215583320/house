<template>
  <my-modal
          :title="title"
          :width="800"
          :visible.sync="visible"
          :fullscreen.sync=fullscreen
          :switch-fullscreen=switchFullscreen>


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
      </a-table>
    </div>

  </my-modal>
</template>

<script>
  import JEllipsis from "../../utils/JEllipsis";
  import { customerDbUtils } from "../../kehu/dbUtils"
  import MyModal from "../../common/myModal/index";
  import {similar, findSubStr, matchRate, matchSite} from "../util/StringUtil"
  export default {
    name: 'CustomerListModal',
    props:{

    },
    components: {MyModal,JEllipsis,customerDbUtils,similar,findSubStr,matchRate},
    data() {
      return {
        title:"客户匹配结果",
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
            sorter:true,
            dataIndex: 'code'
          },
          {
            title:'客户名称',
            sorter:true,
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'电话',
            align:"center",
            dataIndex: 'tel'
          },
          {
            title:'行业',
            sorter:true,
            align:"center",
            dataIndex: 'business'
          },
          {
            title:'面积最小',
            sorter:true,
            align:"center",
            dataIndex: 'area_min',
            customRender:function (t,r,index) {
              if(t!=null){
                return t +' '+ (r.area_unit==null?"":r.area_unit);
              }

            }
          },
          {
            title:'面积最大',
            sorter:true,
            align:"center",
            dataIndex: 'area_max',
            customRender:function (t,r,index) {
              if(t!=null){
                return t +' '+ (r.area_unit==null?"":r.area_unit);
              }

            }
          },
          //   {
          //     title:'面积单位',
          //     align:"center",
          //     dataIndex: 'area_unit'
          //   },
          {
            title:'位置',
            sorter:true,
            align:"center",
            dataIndex: 'site'
          },
          {
            title:'匹配度',
            align:"center",
            dataIndex: 'level',
            scopedSlots:{customRender:'level'},
           /* customRender:function (t,r,index) {
              if(t!=null){
                return t == '1'? '非常高' : '高' ;
              }

            }*/
          },
          {
            title:'楼层',
            sorter:true,
            align:"center",
            dataIndex: 'floor'
          },
          {
            title:'最低价',
            sorter:true,
            align:"center",
            dataIndex: 'price_min',
            customRender:function (t,r,index) {
              if(t!=null){
                return t +' '+ (r.price_unit==null?"":r.price_unit);
              }
            }

          },
          {
            title:'最高价',
            sorter:true,
            align:"center",
            dataIndex: 'price_max',
            customRender:function (t,r,index) {
              if(t!=null){
                return t +' '+ (r.price_unit==null?"":r.price_unit);
              }

            }

          },
          //   {
          //     title:'价格单位',
          //     align:"center",
          //     dataIndex: 'price_unit'
          //   },

          {
            title:'备注',
            align:"center",
            dataIndex: 'remark',
            scopedSlots:{customRender:'jellipsis'},

          },
          {
            title:'信息来源',
            align:"center",
            dataIndex: 'source'
          },

          {
            title:'登记日期',
            sorter:true,
            align:"center",
            dataIndex: 'source_time',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'是否有效',
            align:"center",
            dataIndex: 'lose',
            scopedSlots:{customRender:'lose'}
          },
          {
            title:'失效日期',
            sorter:true,
            align:"center",
            dataIndex: 'lose_time',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },

        ],
        tableScroll:{x :13*147+50},
      }
    },

    computed: {

    },
    watch: {

    },
    created(){

    },
    methods: {
      loadData(arg) {
        this.model = arg;
        this.loading = true;
        let searchParams = {
          'lose':'0',
          'area_begin':arg.area_min,
          'area_end':arg.area_max,
          'price_begin':arg.price_min,
          'price_end':arg.price_max,
          'pageNo':this.ipagination.current,
          'pageSize':this.ipagination.pageSize};
        var sql = customerDbUtils.getMatchSql(searchParams,'2');
        console.log(sql)
        this.$db.all(sql, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            res.forEach(function (item,index){
             /* let rate = matchRate(item.site.length>arg.adress.length?arg.adress.length:item.site.length)
              if(findSubStr(item.site,arg.adress)>=rate){
                item.level = '1'
              }*/
             if(matchSite(arg.adress,item.site)){
               item.level = '1'
             }
            })
            res.sort(sortNumber)
            this.dataSource = res;
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

    }
  }
  function sortNumber(a,b) {
    return parseInt(a.level) - parseInt(b.level)
  }
</script>

<style >

</style>