// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'quill/dist/quill.snow.css'


import VueDND from 'awe-dnd'
Vue.use(VueDND)

Vue.use(ElementUI)

// 引入
import service from "@/utils/request"
Vue.prototype.$http = service


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')