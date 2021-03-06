import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Tabs,TabPane,Select,Option,Tag,TableColumn,Table,Switch,Button } from 'element-ui';
import axios from "axios";
import echarts from "echarts";
import noparamsof24h from "./mock/noparamsof24h";
import noparamsofapp from "./mock/app";
import errorInfo from "./mock/error";


Vue.prototype.$echarts = echarts;
console.log(`noparamsof24h`,noparamsof24h);

Vue.prototype.__noparamsof24h__ = noparamsof24h
Vue.prototype.__noparamsofapp__ = noparamsofapp
Vue.prototype.__errorInfo__ = errorInfo



Vue.prototype.$axios = axios 

Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Tag.name, Tag);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Table.name, Table);
Vue.component(Switch.name, Switch);
Vue.component(Button.name, Button);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
