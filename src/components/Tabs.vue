<template>
    <div>
        <div class="ecomwrap__tabs">
            <div
                v-for="(singleProduct, key, index) in productArray"
                :key="index"
                :ref="'tab' + productArray[key].id"
                class="ecomwrap__tab"
                :class="{ active: currentTab === key }"
                :data-product="productArray[key].id"
                @click="currentTab = key"
            >
                <figure />
                <h3>{{ singleProduct.title }}</h3>
            </div>
        </div>
        <div class="ecomwrap__content">
            <div
                v-for="(singleProduct, key, index) in productArray"
                :key="index"
                :ref="'contentItem' + productArray[key].id"
                class="ecomwrap__content-item"
                :class="{ active: currentTab === key }"
                :data-product="productArray[key].id"
            >
                <product-view
                    v-if="productDisplay === 'Product'"
                    :product="singleProduct"
                    :instance="instanceId"
                    class="ecom ecom--product"
                />
                <bundle-view
                    v-if="productDisplay === 'Bundle'"
                    :product="singleProduct"
                    :instance="instanceId"
                    class="ecom ecom--bundle"
                />
                <bundle-masks-view
                    v-if="productDisplay === 'BundleMasks'"
                    :product="singleProduct"
                    :instance="instanceId"
                    class="ecom ecom--bundle-masks"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ProductView from './ProductView.vue';
import BundleView from './BundleView.vue';
import BundleMasksView from './BundleMasksView.vue';

export default {
    name: 'Tabs',
    components: {
        ProductView,
        BundleView,
        BundleMasksView
    },
    props: {
        productArray: {
            type: Array,
            default: () => []
        },
        productDisplay: {
            type: String,
            default: () => ''
        },
        instanceId: {
            type: String,
            default: () => ''
        }
    },
    data () {
        return {
            currentTab: 0
        };
    },
    methods: {
        getActiveItemFromUrl () {
            // TODO: set active tab form URL params
        }
    }
};
</script>

<style lang="scss" src="../scss/tabs.scss"></style>
