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
          <a-input v-decorator="[ 'area_min', validatorRules.area]" placeholder="请输入最小面积" class="price_min_width">
          </a-input>
          <span class="query-group-split-cust"></span>
          <a-input v-decorator="[ 'area_max']" placeholder="请输入最大面积" style="width: 100%">
           <a-select slot="addonAfter"  v-decorator="[ 'area_unit',{'initialValue':'平米'}]" class="price_max_width">
              <a-select-option value="平米">平米</a-select-option>
              <a-select-option value="亩">亩</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item label="楼号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'building', validatorRules.building]" placeholder="请输入楼号"></a-input>
        </a-form-item>
        <a-form-item label="楼层" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'floor', validatorRules.floor]" placeholder="请输入楼层"></a-input>
        </a-form-item>
        <a-form-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>
          <a-input v-decorator="['price_min',validatorRules.price_min]" placeholder="请输入最低价格" class="price_min_width">
            </a-input>
            <span class="query-group-split-cust"></span>
          <a-input v-decorator="[ 'price_max']" placeholder="请输入最高价格" class="price_max_width" >
            
          
          <a-select slot="addonAfter" v-decorator="[ 'price_unit',{'initialValue':'元'}]"  style="width: 80px">
              <a-select-option value="元">元</a-select-option>
              <a-select-option value="万元">万元</a-select-option>
            </a-select>
           </a-input>
           </span>
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
         <a-form-item label="委托" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'entrust']" placeholder="请输入委托"></a-input>
        </a-form-item>
        <!-- <a-form-item label="是否租出" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="[ 'sold', validatorRules.sold]" placeholder="请输入是否租出"></a-input
      <a-radio-group name="sold" v-decorator="[ 'sold', {'initialValue':0}]">
                    <a-radio :value="0">未租出</a-radio>
                    <a-radio :value="1">已租出</a-radio>
                    
                </a-radio-group>
        </a-form-item> -->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import {dbUtils} from '../dbUtils'

  export default {
    name: "HouseModal",
    components: { 
      pick,
      dbUtils,
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
            {validator:this.validateInputCode}
            
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
          price_min: {rules: [
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
           price_max: {rules: [
           {pattern:/^-?\d+\.?\d*$/, message: '请输入数字!'},
          ]},
          voltage: {rules: [
           
          ]},
          remark: {rules: [
          ]},
          source: {rules: [
          ]},
          sold: {rules: [
          ]},
        },
       
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
          this.form.setFieldsValue(pick(this.model,'code','adress','landlord','tel','area_min','area_max','areaUnit','building','floor','price_min','price_max','priceUnit','voltage','remark','source','entrust','sourceTime','sold','sellTime'))
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
              runSql = dbUtils.insertHouseSql;
            }else{
              runSql = dbUtils.getUpdateHouseSql(this.model.id);
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)

             this.$db.serialize(()=>{
                    this.$db.run('BEGIN');
                 this.$db.run(runSql,'','',
             formData.code,formData.adress,formData.landlord,formData.tel,formData.area_min,formData.area_max,
             formData.area_unit,formData.building,formData.floor,formData.price_min,formData.price_max,
             formData.price_unit,formData.voltage,formData.remark,formData.source,formData.entrust,
             datetime('now'),formData.sell_time,err=>{
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
        this.form.setFieldsValue(pick(row,'code','adress','landlord','tel','area_min','area_max','areaUnit','building','floor','price_min','price_max','priceUnit','voltage','remark','source','entrust','sourceTime','sold','sellTime'))
      },
      validateInputCode(rule,value,callback){
        console.log(dbUtils.getValidateSql(value))
        this.$db.all(dbUtils.getValidateSql(value),(err,res)=>{
          console.log(res)
          if (res != undefined && res.length > 0){
            callback("编码重复！")
          }
        })
      }
      
    }
  }
</script>
<style scoped>
.price_min_width{width:calc(50% - 55px)!important}
.price_max_width{width:calc(50% + 25px)!important;}
.query-group-split-cust:before{content:"~";width: 20px;display: inline-block;text-align: center}

</style>