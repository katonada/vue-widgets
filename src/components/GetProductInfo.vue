<template>
    <div />
</template>

<script>
import axios from 'axios';

export default {
    name: 'GetProductInfo',
    data () {
        return {
            instanceId: '',
            productId: '',
            productType: '',
            blockViewMode: '',
            language: '',
            view: ''
        };
    },
    created () {
    // Get instance id from DOM.
    // this.instanceId = this.$parent.$parent.$options.el.id
    // Get product ID from drupal settings.
    // this.productId = window.drupalSettings.pdb.configuration[this.instanceId].productId
    // this.productType = window.drupalSettings.pdb.configuration[this.instanceId].productType
    // this.blockViewMode = window.drupalSettings.pdb.configuration[this.instanceId].blockViewMode
    // this.language = window.drupalSettings.path.currentLanguage
        this.instanceId = 'hash123hash';
        this.productId = '156'; // 128,129  //156
        this.productType = 'product'; // 'bundle'
        this.blockViewMode = 'ecommerce_b';
        this.language = 'en';
        this.getProduct();
    },
    methods: {

        getProduct () {
            axios
            // .get(process.env.VUE_APP_GET + this.productType + '/' + this.productId, {
                .get('api/bundle.json', {
                    headers: {
                        'Accept-Language': this.language
                    }
                })
                .then(response => { this.emitProductInfo(response.data.data); })
                .catch(error => { console.log(error); });
        },

        emitProductInfo (ProductArray) {
            console.log(ProductArray.type);
            if (ProductArray.type === 'product') {
                this.view = 'Product';
            } else {
                // ProductArray.attributes[0].bundle === 'default' ? this.view = 'Bundle' : this.view = 'BundleMasks';
                this.view = (ProductArray.attributes[0].bundle === 'default') ? 'Bundle' : 'BundleMasks';
            }
            this.$emit('product-response', { // must be kebab-case like components
                ProductArray: ProductArray.attributes,
                view: this.view,
                instanceId: this.instanceId,
                blockViewMode: this.blockViewMode
            });
        }
    }
};
</script>
