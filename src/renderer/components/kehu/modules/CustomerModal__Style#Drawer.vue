<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">
  
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入客户名称"></a-input>
        </a-form-item>
        <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tel', validatorRules.tel]" placeholder="请输入电话"></a-input>
        </a-form-item>
        <a-form-item label="行业" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'business', validatorRules.business]" placeholder="请输入行业"></a-input>
        </a-form-item>
        <a-form-item label="面积最小" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'areaMin', validatorRules.areaMin]" placeholder="请输入面积最小" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="面积最大" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'areaMax', validatorRules.areaMax]" placeholder="请输入面积最大" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="面积单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'areaUnit', validatorRules.areaUnit]" placeholder="请输入面积单位"></a-input>
        </a-form-item>
        <a-form-item label="位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'site', validatorRules.site]" placeholder="请输入位置"></a-input>
        </a-form-item>
        <a-form-item label="楼层" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'floor', validatorRules.floor]" placeholder="请输入楼层"></a-input>
        </a-form-item>
        <a-form-item label="价格最低" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'priceMin', validatorRules.priceMin]" placeholder="请输入价格最低" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="价格最高" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'priceMax', validatorRules.priceMax]" placeholder="请输入价格最高" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="价格单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'priceUnit', validatorRules.priceUnit]" placeholder="请输入价格单位"></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'remark', validatorRules.remark]" placeholder="请输入备注"></a-input>
        </a-form-item>
        <a-form-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'source', validatorRules.source]" placeholder="请输入客户来源"></a-input>
        </a-form-item>
        
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  
  export default {
    name: "CustomerModal",
    components: { 
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
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
            {pattern:/^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
          ]},
          business: {rules: [
          ]},
          areaMin: {rules: [
          ]},
          areaMax: {rules: [
          ]},
          areaUnit: {rules: [
          ]},
          site: {rules: [
          ]},
          floor: {rules: [
          ]},
          priceMin: {rules: [
          ]},
          priceMax: {rules: [
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
          this.form.setFieldsValue(pick(this.model,'name','tel','business','areaMin','areaMax','areaUnit','site','floor','priceMin','priceMax','priceUnit','remark','source','sourceDate'))
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
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'name','tel','business','areaMin','areaMax','areaUnit','site','floor','priceMin','priceMax','priceUnit','remark','source','sourceDate'))
      }
      
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>