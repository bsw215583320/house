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
      <!--  <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'code', validatorRules.code]" placeholder="请输入编号"></a-input>
        </a-form-item>-->
        <a-form-item label="选择房源"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-house v-decorator="[ 'house_id', validatorRules.house_id]" :multi="false"></j-select-house>
        </a-form-item>
       <!-- <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入客户名称"></a-input>
        </a-form-item>-->
        <a-form-item label="带看时间"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date v-decorator="[ 'take_time', validatorRules.take_time]" :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss"/>
        </a-form-item>
        <a-form-item label="客户评价" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="[ 'evaluate', validatorRules.evaluate]" placeholder="客户评价"></a-input>
      </a-form-item>
        <a-form-item label="客户要求" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'request', validatorRules.business]" placeholder="客户要求"></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'remark', validatorRules.remark]" placeholder="请输入备注"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import {takeLookDbUtils} from '../dbUtils'
  import {cfgPath} from "../../../utils/settings";
  import {getDateByStr,dateToString} from "../../fangyuan/util/DateUtil"
  import JSelectHouse from "../../common/JSelectHouse";
  import JDate from "../../common/JDate";

  export default {
    name: "DaiKanModal",
    components: {
      JSelectHouse,
      pick,
      takeLookDbUtils,
      cfgPath,
      getDateByStr,dateToString,
      JDate
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

          house_id: {rules: [
            {required: true, message: '请选择房源!'},
          ]},
          take_time: {rules: [
            {required: true, message: '请选择带看时间!'},
            // {pattern:/^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
          ]},
          evaluate: {rules: [
          ]},
          request: {rules: [
              {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
            ]},

          remark: {rules: [
          ]},

        },

      }
    },
    created () {

    },
    methods: {
      add (arg) {
        this.edit({"customer_id":arg});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'house_id','take_time','evaluate','request','remark'))
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
              runSql = takeLookDbUtils.insertSql;
            }else{
              runSql = takeLookDbUtils.getUpdateSql(this.model.id);
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            this.$db.serialize(()=>{
              console.log("runSql : " + runSql)
              this.$db.run('BEGIN');
              this.$db.run(runSql,'','',
                      '',formData.customer_id,formData.house_id,formData.take_time,formData.evaluate,formData.request,
                      formData.remark,err=>{
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
        this.form.setFieldsValue(pick(row,'house_id','take_time','evaluate','request','remark'))
      },
      validateInputCode(rule, value, callback) {
        this.$db.all(takeLookDbUtils.getValidateSql(value), (err, res) => {
          console.log(err)
          console.log(res)

          console.log(this.model.id)
          if (res != undefined && res.length > 0 && !this.model.id) {
            callback("编码重复！")
          }
          callback();
        })
      }
      
    }
  }
</script>
<style scoped>
  .price_min_width{margin:0 !important;display: inline-block !important; width:calc(50% - 50px)!important}
  .price_max_width{margin:0 !important;display: inline-block !important; width:calc(50% + 30px)!important; }
  .query-group-split-cust:before{content:"~";width: 20px;display: inline-block;text-align: center}


</style>