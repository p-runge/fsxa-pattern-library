import "vue-tsx-support/enable-check";
import Vue from "vue";
import App from "./App";
import createStore from "./store";

Vue.config.productionTip = false;

const store = createStore({
  apiKey: "f5a14f78-d8b8-4525-a814-63b49e0436ee",
  caas:
    "https://caas.staging.delivery-platform.e-spirit.live/0b975076-5061-44e6-bbce-c1d9f73f6606/preview.content",
  navigationService:
    "https://do-caas-core02.navigation.prod.delivery-platform.e-spirit.live/navigation/preview.0b975076-5061-44e6-bbce-c1d9f73f6606",
  locale: "de_DE"
});
new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
