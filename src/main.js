/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";


// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

import Toasted from "vue-toasted";

Vue.use(Toasted);
import VueTelInput from "vue-tel-input";

Vue.use(VueTelInput);


import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.$cookies.config('365d')

// axios
// import axios from "./axios.js"
// Vue.prototype.$http = axios
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: store.state.baseUrl
});


Vue.prototype.$axios = axiosInstance;

axiosInstance.defaults.timeout = 15000;

axiosInstance.interceptors.request.use(
  config => {
    if (
      (store.state.token == "" || store.state.token == null) &&
      !config.url.includes("login") &&
      !config.url.includes("api/users/add")
    ) {
        //debugger
      Vue.toasted.show("Authorization Failed", {
        theme: "outline",
        position: "bottom-right",
        duration: 5000
      });

      router.push("/pages/not-authorized");

      return Promise.reject(error);
    }
    if (store.state.token !== "") {
      console.log(`Bearer ${store.state.token}` + " eklendi.");
      config.headers["Authorization"] = `Bearer ${store.state.token}`;
    }
    config.baseURL = store.state.baseUrl;

    config.headers["Accept"] = "*/*";

    return config;
  },

  error => {
    this.$toasted.show(error, {
      theme: "outline",
      position: "bottom-right",
      duration: 5000
    });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
     if(response.data != null){
         if(!response.data.success){
             Vue.toasted.show(response.data.message, {
                 theme: "outline",
                 position: "bottom-right",
                 duration: 3000
             });
         }
     }

    if(response.config.url.includes("getByCreatedUser")){
        if(response.data.data != null && response.data.data.length > 0){
           // debugger
            for (var i =0; i<response.data.data.length;i++){
                let baseUrl = store.state.baseUrl;
                let fromLink = response.data.data[i].fromLink;
                let newUrl =  baseUrl + "r/"+ fromLink;
                response.data.data[i].fromLink = newUrl;
            }
        }
    }


    if (!response.config.url.includes("refresh"))
      store.state.refreshTimer = true;


    return response;
  },
  error => {
    if (
      error.response != null &&
      error.response.data != null &&
      error.response.data.message != null
    ) {
      Vue.toasted.show(error.response.data.message, {
        theme: "outline",
        position: "bottom-right",
        duration: 5000
      });
    } else
      Vue.toasted.show(error.message, {
        theme: "outline",
        position: "bottom-right",
        duration: 5000
      });
    if (error.message.includes("401")) router.push("/pages/not-authorized");
    //   return Promise.reject(response);
    return Promise.resolve(error);
  }
);

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "./router";

// Vuex Store

import VeeValidate from "vee-validate";
Vue.use(VeeValidate);
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);


// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false;

Array.prototype.select = function(expr) {
  var arr = this;
  //do custom stuff
  return arr.map(expr); //or $.map(expr);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
