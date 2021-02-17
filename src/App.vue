<template>
  <div>
    <get-product-info @ProductResponse="solveProductResponse" />

    <!-- BEGIN MULTIPLE ITEMS (TABS) RENDER -->
    <tabs
      v-if="productArray.length > 1"
      :productArray="productArray"
      :productDisplay="productDisplay"
      :instanceId="instanceId"
      class="ecomwrap"
    />
    <!-- END MULTIPLE ITEMS (TABS) RENDER -->

    <!-- BEGIN SINGLE ITEM RENDER -->
    <template v-else>
      <product-view
        v-if="productDisplay === 'Product'"
        :product="productArray[0]"
        :instance="instanceId"
        :blockViewMode='blockViewMode'
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
console.clear();

import GetProductInfo from "./components/GetProductInfo.vue";
import ProductView from "./components/ProductView.vue";
import BundleView from "./components/BundleView.vue";
import BundleMasksView from "./components/BundleMasksView.vue";
import Tabs from "./components/Tabs.vue";

export default {
  name: 'app',
  components: {
    GetProductInfo,
    ProductView,
    BundleView,
    BundleMasksView,
    Tabs
  },
  data() {
    return {
      productArray: [],
      instanceId: '',
      productDisplay: '',
      blockViewMode: ''
    }
  },
  methods: {
    solveProductResponse(response) {
      this.productArray = response.ProductArray
      this.productDisplay = response.view
      this.instanceId = response.instanceId
      this.blockViewMode = response.blockViewMode
    }
  }
}
</script>

<style lang="scss" src="./scss/app.scss"></style>
<style lang="scss" src="./scss/faqswiss.scss"></style>
