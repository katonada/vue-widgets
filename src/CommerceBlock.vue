<template>
    <div>
        {{ getMQ }}
        <!-- BEGIN MULTIPLE ITEMS (TABS) RENDER -->
        <tabs
            v-if="productArray.length > 1"
            :product-array="productArray"
            :product-display="productDisplay"
            :instance-id="instanceId"
            class="ecomwrap"
        />
        <!-- END MULTIPLE ITEMS (TABS) RENDER -->

        <!-- BEGIN SINGLE ITEM RENDER -->
        <template v-else>
            <product-view
                v-if="productDisplay === 'Product'"
                :product="productArray[0]"
                :instance="instanceId"
                :block-view-mode="blockViewMode"
                :class="'ecom ecom--product ecom--' + blockViewMode"
            />
            <bundle-view
                v-if="productDisplay === 'Bundle'"
                :product="productArray[0]"
                :instance="instanceId"
                class="ecom ecom--bundle"
            />
            <bundle-masks-view
                v-if="productDisplay === 'BundleMasks'"
                :product="productArray[0]"
                :instance="instanceId"
                class="ecom ecom--bundle-masks"
            />
        </template>
    <!-- END SINGLE ITEM RENDER -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { apiServices } from '@/mixins/apiMixin';

import ProductView from './components/ProductView.vue';
import BundleView from './components/BundleView.vue';
import BundleMasksView from './components/BundleMasksView.vue';
import Tabs from './components/Tabs.vue';

export default {
    name: 'CommerceBlock',

    components: {
        ProductView,
        BundleView,
        BundleMasksView,
        Tabs
    },

    props: {
        apiUrl: {
            type: String,
            default: ''
        },
        apiInstanceId: {
            type: String,
            default: ''
        }
    },

    data () {
        return {
            productArray: [],
            productDisplay: '',

            instanceId: 'hash123hash',
            productId: '156', // 128,129  //156
            productType: 'product', // 'bundle
            blockViewMode: 'ecommerce_b',
            language: 'en'
        };
    },

    computed: {
        ...mapGetters(['getMQ']),
        // ...mapGetters('meta', ['main']),
    },

    created () {
        this.getProduct();
    },

    methods: {

        solveProductResponse (response) {
            this.productArray = response.ProductArray;
            this.productDisplay = response.view;
            this.instanceId = response.instanceId;
            this.blockViewMode = response.blockViewMode;
        },

        getProduct () {
            // .get(process.env.VUE_APP_GET + this.productType + '/' + this.productId, {
            apiServices.get(`api/${this.apiUrl}.json`, {
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

            const productResponse = {
                ProductArray: ProductArray.attributes,
                view: this.view,
                instanceId: this.instanceId,
                blockViewMode: this.blockViewMode
            };

            this.solveProductResponse(productResponse); // $emit event must be kebab-case like components
        }
    }
};
</script>

<style lang="scss" src="./scss/app.scss"></style>
<style lang="scss" src="./scss/faqswiss.scss"></style>
