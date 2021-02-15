<template>
  <div>
    <div class="ecomwrap__tabs">
      <div
        v-for="(singleProduct, key, index) in productArray"
        :key="index"
        class="ecomwrap__tab"
        :class="{ active: currentTab === key }"
        :data-product="productArray[key].id"
        :ref="'tab' + productArray[key].id"
        @click="currentTab = key"
      >
        <figure></figure>
        <h3>{{ singleProduct.title }}</h3>
      </div>
    </div>
    <div class="ecomwrap__content">
      <div
        v-for="(singleProduct, key, index) in productArray"
        :key="index"
        class="ecomwrap__content-item"
        :class="{ active: currentTab === key }"
        :data-product="productArray[key].id"
        :ref="'contentItem' + productArray[key].id"
      >
        <ProductView
          v-if="productDisplay === 'Product'"
          :product="singleProduct"
          :instance="instanceId"
          class="ecom ecom--product"
        />
        <BundleView
          v-if="productDisplay === 'Bundle'"
          :product="singleProduct"
          :instance="instanceId"
          class="ecom ecom--bundle"
        />
        <BundleMasksView
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
import ProductView from "./ProductView.vue";
import BundleView from "./BundleView.vue";
import BundleMasksView from "./BundleMasksView.vue";

export default {
  name: "Tabs",
  components: {
    ProductView,
    BundleView,
    BundleMasksView
  },
  props: {
    productArray: {
      type: Array,
    },
    productDisplay: {
      type: String
    },
    instanceId: {
      type: String
    }
  },
  data() {
    return {
      currentTab: 0
    }
  },
  methods: {
    getActiveItemFromUrl() {
      // TODO: set active tab form URL params
    }
  }
};
</script>

<style lang="scss" src="../scss/tabs.scss"></style>