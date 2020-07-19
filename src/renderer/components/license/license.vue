<template>
    <div >
                <div style="font-size: 35px;text-align: center;padding-top: 5%">
                    欢迎使用
                </div>
        <div style="font-size: 15px;text-align: center;padding-top: 2%;color: darkgreen">
            请将机器码提供给软件开发商，以获取注册码。
        </div>

        <a-form style="padding-left: 15%;padding-top:3%">
            <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="机器码"
            >
               <!-- <a-input
                        v-decorator="[
          'machineId',

        ]"

                />-->
                <span>{{originId}}</span>
            </a-form-item>
            <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="注册码"
            >
                <a-textarea
                        v-model="code"
                        placeholder="请输入注册码" :rows="6"
                />
            </a-form-item>

            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol" align="center">
                <a-button type="primary" @click="toService">
                    注册
                </a-button>
            </a-form-item>
        </a-form>
    </div>

</template>

<script>
    import fse from 'fs-extra'
    import md5 from 'js-md5';
    import JSEncrypt from 'jsencrypt';
    import {machineId, machineIdSync} from 'node-machine-id';
    import {cfgPath, licPath} from "../../utils/settings";
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    };
    const formTailLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12, offset: 4 },
    };
    export default {
        name: "license",
        comments:{
            fse,
            md5,
            machineId,
            machineIdSync,
            JSEncrypt,
            licPath

        },
        data(){

            return {
                code:"",
                checkNick: false,
                formItemLayout,
                formTailLayout,
                originId:"true"

            }
        },
        created() {


            this.encrypt();
        },
        methods: {

            encrypt(){
                this.originId = machineIdSync({original: true});
                const lic  = fse.readJsonSync(licPath)
                if(lic.code == ""||lic.code==null||lic.code == undefined){
                    console.log(12341234123423)
                    return;
                }
                this.code = lic.code;
                console.log("code",this.code);

                this.toService();
            },

            toService(){

                let decrypt = new JSEncrypt() // 新建JSEncrypt对象
                let privateKey = `MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJgFv/OzLVGw5vsk0DKcWgOXD4SGhziOjLqHmXvmc453B5jv14P0IrBkBA+W8WPdz4pQ5LCW9LuI4aj/4rOUdI2qrVivWP8MO5F0hGMaei8M8eRyUiimogx+5f574d3e+KX/bkfmF4MNIj/wRuoRKZ4Go2EUmm8nfXhd6kbCThDnAgMBAAECgYAecNBN+Svy9qxZz7ZM3Bf+LgpybAm5nnm5hBuMvsmW1mjUC/qotoMXtP9HK99sMucy+B3C6odY4gDluU9ozCpGP6ao3mT5cLPO5JP+iuALkzSRUCMP9z4pq6anZ809ADny9zb6Bzjokp+HB/02sroWtSjLF+DfBIlwQAaP0bTPSQJBAOnlO3xoq/OuUx8dtpk3eGY+oIOTxJHMJQEEGkXa/c3tI/wGpv/9VWUWNl4PrZbFkZWwoGT0+U1xFarOCcbPaQ0CQQCmY7eVBtb5eJe64eveXAuVPPDa26aJzSqfGQTqp+pbi8R5E5qdDAoLYOIdzu86htKJk6XFl92RAKVjNdXb+jzDAkAMK4NG2+NmkIF+svsXSc2X9FZBwmSN+YNLZD1BuT1Pg7FFocr6suHImrlFd6demvUSRthxqFV4dBPeiU307EHZAkBFOtAzjXj8q5RWCZIeHqYjHgwIw8NzKo5FTB+jkuIL3QeOaP23wj6bpV/vjx4yd845t9kNcbaakm497TRiJqgJAkAqrpG7RgEgaddunajfQITTOltCi/olYKmQCuj+gj8kTF5AJy6YnmY/dowqpiHjhS0XYnKVliJE5k+fvRpy1+tM`
                decrypt.setPrivateKey(privateKey)
                let getWord = decrypt.decrypt(this.code) // 解密
                console.log("getWord",getWord) // 输出，可以在控制台看到解密得到的字段
                console.log("originId",this.originId)
                if (getWord === this.originId){
                    let lic = {"code":this.code}
                    fse.writeJson(licPath,lic).then(err=>{
                        console.log("成功")
                    }).catch(error => {
                        console.log("失败")
                    });
                    this.$router.push('/service/house')
                }else{
                    this.$message.error('注册失败，请检查注册码是否正确');
                }

            },


        }
    }
</script>

<style scoped>

</style>