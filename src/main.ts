import "vue-tsx-support/enable-check";
import Vue from "vue";
import "fsxa-ui/dist/fsxa-ui.css";
import App from "./App";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
Vue.config.productionTip = false;

const store = createStore(getFSXAConfigFromEnvFile());
new Vue({
  store,
  render: h => h(App),
}).$mount("#app");
