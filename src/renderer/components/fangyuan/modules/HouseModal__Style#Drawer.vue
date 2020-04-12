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

        <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'code', validatorRules.code]" placeholder="请输入编号"></a-input>
        </a-form-item>
        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'adress', validatorRules.adress]" placeholder="请输入地址"></a-input>
        </a-form-item>
        <a-form-item label="房东" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'landlord', validatorRules.landlord]" placeholder="请输入房东"></a-input>
        </a-form-item>
        <a-form-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tel', validatorRules.tel]" placeholder="请输入电话"></a-input>
        </a-form-item>
        <a-form-item label="面积" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'area', validatorRules.area]" placeholder="请输入面积" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="楼号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'building', validatorRules.building]" placeholder="请输入楼号"></a-input>
        </a-form-item>
        <a-form-item label="楼层" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'floor', validatorRules.floor]" placeholder="请输入楼层"></a-input>
        </a-form-item>
        <a-form-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'price', validatorRules.price]" placeholder="请输入价格" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="电压" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'voltage', validatorRules.voltage]" placeholder="请输入电压"></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'remark', validatorRules.remark]" placeholder="请输入备注"></a-input>
        </a-form-item>
        <a-form-item label="信息来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'source', validatorRules.source]" placeholder="请输入信息来源"></a-input>
        </a-form-item>
        <a-form-item label="是否租出" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'sold', validatorRules.sold]" placeholder="请输入是否租出"></a-input>
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
    name: "HouseModal",
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
          code: {rules: [
            {required: true, message: '请输入编号!'},
            { validator: (rule, value, callback) => validateDuplicateValue('house', 'code', value, this.model.id, callback)},
          ]},
          adress: {rules: [
            {required: true, message: '请输入地址!'},
          ]},
          landlord: {rules: [
          ]},
          tel: {rules: [
          ]},
          area: {rules: [
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
          building: {rules: [
          ]},
          floor: {rules: [
          ]},
          price: {rules: [
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
          voltage: {rules: [
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
          remark: {rules: [
          ]},
          source: {rules: [
          ]},
          sold: {rules: [
          ]},
        },
        url: {
          add: "/house/house/add",
          edit: "/house/house/edit",
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
          this.form.setFieldsValue(pick(this.model,'code','adress','landlord','tel','area','areaUnit','building','floor','price','priceUnit','voltage','remark','source','sourceTime','sold','sellTime'))
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
        this.form.setFieldsValue(pick(row,'code','adress','landlord','tel','area','areaUnit','building','floor','price','priceUnit','voltage','remark','source','sourceTime','sold','sellTime'))
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