import Vue from 'vue';
import { store } from '@/store/store';

import Header from '@/Header';
import CommerceBlock from '@/CommerceBlock.vue';

Vue.config.productionTip = false;
Vue.config.devtools = process.env.BUILD_TYPE !== 'production';
Vue.config.performance = process.env.NODE_ENV !== 'production';

// // Create a root instance for each block
// const vueElements = document.getElementsByClassName('commerce_block');
// const count = vueElements.length;

// // Loop through each block
// for (let i = 0; i < count; i++) {
//     console.log('this el data-api', vueElements[0].dataset.api);
//     // eslint-disable-next-line no-new
//     new Vue({
//         el: vueElements[0],
//         render: h => h(App, {
//             props: {
//                 apiUrl: vueElements[0].dataset.api
//             }
//         })
//     });
// }

// eslint-disable-next-line no-new
new Vue({
    el: '#header',
    store,
    render: h => h(Header)
});

// create a constructor for your widget
const Widget = Vue.extend({

    store,
    render (h) {
        return h(CommerceBlock, {
            props: {
                apiUrl: this.$el.dataset.api,
                apiInstanceId: this.$el.dataset.instanceId,
            }
        });
    }
});

const nodes = document.querySelectorAll('.commerce_block');
nodes.forEach(node => new Widget({ el: node }));
