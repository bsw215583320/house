<template>
  <div>
    <a-input-search
      v-model="HouseNames"
      placeholder="请选择房源"
      disabled
      @search="onSearchHouse">
      <a-button slot="enterButton" :disabled="disabled">选择房源</a-button>
    </a-input-search>
    <j-select-house-modal ref="selectModal" :modal-width="modalWidth" :multi="multi" @ok="selectOK" :house-ids="value" @initComp="initComp"/>
  </div>
</template>

<script>
  import JSelectHouseModal from "./modules/JSelectHouseModal";

  export default {
    name: 'JSelectHouse',
    components: {JSelectHouseModal},
    props: {
      modalWidth: {
        type: String,
        default: '80%',
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      multi: {
        type: Boolean,
        default: true,
        required: false
      },
    },
    data() {
      return {
        house_id: "",
        HouseNames: ""
      }
    },
    mounted() {
      this.house_id = this.value
    },
    watch: {
      value(val) {
        this.house_id = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(HouseNames) {
        this.HouseNames = HouseNames
      },
      onSearchHouse() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows, idstr) {
        console.log("当前选中房源", rows)
        console.log("当前选中房源ID", idstr)
        if (!rows) {
          this.HouseNames = ''
          this.house_id = ''
        } else {
          let temp = ''
          for (let item of rows) {
            temp += ',' + item.code
          }
          this.HouseNames = temp.substring(1)
          this.house_id = idstr
        }
        console.log("houseName",this.HouseNames);
        this.$emit("change", this.house_id)
      }
    }
  }
</script>

<style scoped>

</style>