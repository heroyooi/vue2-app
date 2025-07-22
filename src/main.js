import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import './assets/base.css';

Vue.config.productionTip = false;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
