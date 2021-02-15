import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// Create a root instance for each block
const vueElements = document.getElementsByClassName('commerce_block');
const count = vueElements.length;

// Loop through each block
for (let i = 0; i < count; i++) {
  new Vue({
    el: vueElements[0],
    render: h => h(App)
  })
}
