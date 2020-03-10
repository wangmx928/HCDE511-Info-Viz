import Vue from "vue";
import VueLodash from "vue-lodash";
import lodash from "lodash";
import Vuex from "vuex";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import AsyncComputed from "vue-async-computed";
import App from "./App.vue";
import { appStore } from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(AsyncComputed);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueLodash, { lodash: lodash });

Vue.config.productionTip = false;

const store = new Vuex.Store(appStore);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
