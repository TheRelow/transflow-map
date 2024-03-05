import Vue from "vue";
import App from "./App.vue";
import "@/assets/styles/main.scss";

Vue.config.productionTip = false;

// router
import router from "./router";

// leaflet
import "leaflet/dist/leaflet.css";

// fix for default markers
// import { Icon } from "leaflet";
// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

// pinia
import { createPinia, PiniaVuePlugin } from "pinia";
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
