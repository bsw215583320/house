<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'code', validatorRules.code]" placeholder="请输入编号"></a-input>
        </a-form-item>
        <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入客户名称"></a-input>
        </a-form-item>
        <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tel', validatorRules.tel]" placeholder="请输入电话"></a-input>
        </a-form-item>
        <a-form-item label="行业" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'business', validatorRules.business]" placeholder="请输入行业"></a-input>
        </a-form-item>
        <a-form-item label="面积" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin: 0">
          <a-form-item class="price_min_width" >
            <a-input v-decorator="[ 'area_min', validatorRules.area]" placeholder="请输入最小面积" >
            </a-input>
          </a-form-item>
          <span class="query-group-split-cust"></span>
          <a-form-item class="price_max_width">
            <a-input v-decorator="[ 'area_max',validatorRules.area]" placeholder="请输入最大面积" >
              <a-select slot="addonAfter"  v-decorator="[ 'area_unit',{'initialValue':'平米'}]"  style="width: 80px">
                <a-select-option v-for="(unit,i) in areaUnits" :value="unit" :key="i">{{unit}}</a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
        </a-form-item>
        <a-form-item label="位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'site', validatorRules.site]" placeholder="请输入位置"></a-input>
        </a-form-item>
        <a-form-item label="楼层" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'floor', validatorRules.floor]" placeholder="请输入楼层"></a-input>
        </a-form-item>
        <a-form-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-form-item class="price_min_width">
            <a-input v-decorator="['price_min',validatorRules.price_min]" placeholder="请输入最低价格" >
            </a-input>
          </a-form-item>
          <span class="query-group-split-cust"></span>
          <a-form-item class="price_max_width">
            <a-input v-decorator="[ 'price_max',validatorRules.price_min]" placeholder="请输入最高价格"  >
              <a-select slot="addonAfter" v-decorator="[ 'price_unit',{'initialValue':'元'}]"  style="width: 80px">
                <a-select-option v-for="(punit,i) in priceUnits" :value="punit" :key="i">{{punit}}</a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'remark', validatorRules.remark]" placeholder="请输入备注"></a-input>
        </a-form-item>
        <a-form-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'source', validatorRules.source]" placeholder="请输入客户来源"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import fse from 'fs-extra'
  import pick from 'lodash.pick'
  import {dbUtils} from '../dbUtils'
  import {cfgPath} from "../../../utils/settings";
  import {getDateByStr,dateToString} from "../../fangyuan/util/DateUtil"

  export default {
    name: "CustomerModal",
    components: {
      pick,
      dbUtils,
      cfgPath,
      getDateByStr,dateToString
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        areaUnits:[],
        priceUnits:[],
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          name: {rules: [
            {required: true, message: '请输入客户名称!'},
          ]},
          tel: {rules: [
            {required: true, message: '请输入电话!'},
            // {pattern:/^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
          ]},
          business: {rules: [
          ]},
          area: {rules: [
              {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]},
          areaUnit: {rules: [
          ]},
          site: {rules: [
          ]},
          floor: {rules: [
          ]},
          price_min: {rules: [
              {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]},
          price_max: {rules: [
              {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]},
          priceUnit: {rules: [
          ]},
          remark: {rules: [
          ]},
          source: {rules: [
          ]},
        },
        url: {
          add: "/kehu/customer/add",
          edit: "/kehu/customer/edit",
        }
      }
    },
    created () {
      fse.readJson(cfgPath).then(units=>{
        this.areaUnits = units.面积单位
        this.priceUnits = units.价格单位
      })
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'code','name','tel','business','areaMin','areaMax','areaUnit','site','floor','priceMin','priceMax','priceUnit','remark','source','sourceDate'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            var runSql;
            if(!this.model.id){
              runSql = dbUtils.insertCustomerSql;
            }else{
              runSql = dbUtils.getUpdateCustomerSql(this.model.id);
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            this.$db.serialize(()=>{
              console.log("runSql : " + runSql)
              this.$db.run('BEGIN');
              this.$db.run(runSql,'','',
                      formData.code,formData.name,formData.business,formData.tel,formData.area_min,formData.area_max,
                      formData.area_unit,formData.site,formData.floor,formData.price_min,formData.price_max,
                      formData.price_unit,formData.remark,formData.source,
                      dateToString(new Date()),formData.lose_time,err=>{
                        if(err){
                          that.$logger(err)
                          this.$db.run('ROLLBACK');
                          return false;
                        }
                        this.$db.run('COMMIT');
                        that.confirmLoading = false;
                        that.$emit('ok')
                        that.close();
                      });
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'code','name','tel','business','areaMin','areaMax','areaUnit','site','floor','priceMin','priceMax','priceUnit','remark','source','sourceDate'))
      },

      
    }
  }
</script>
<style scoped>
  .price_min_width{margin:0 !important;display: inline-block !important; width:calc(50% - 50px)!important}
  .price_max_width{margin:0 !important;display: inline-block !important; width:calc(50% + 30px)!important; }
  .query-group-split-cust:before{content:"~";width: 20px;display: inline-block;text-align: center}


</style>