import Vue from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue';

import App from './App'
import router from './router'
import store from './store'
import db from './utils/db'
import logger from './utils/logger'
import 'ant-design-vue/dist/antd.less'
import './components/fangyuan/util/filter'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Antd);

Vue.prototype.$db = db;
Vue.prototype.$logger = logger;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
