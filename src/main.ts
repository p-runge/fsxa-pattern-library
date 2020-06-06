import "vue-tsx-support/enable-check";
import Vue from "vue";
import App from "./App";
import createStore from "./store";
import { getFSXAConfigFromEnvFile } from "./utils/config";
console.log("PROCESS.ENV", process.env.API_KEY);
Vue.config.productionTip = false;

const store = createStore(getFSXAConfigFromEnvFile());
console.log(store.state);
new Vue({
  store,
  render: h => h(App),
}).$mount("#app");
