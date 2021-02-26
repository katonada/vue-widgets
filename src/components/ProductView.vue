<template>
    <div>
        <div :class="'ecom__wrap ecom__wrap--' + product.bundle">
            <div class="ecom__container">
                <!-- TODO: Get current activeVariation from URL -->
                <!-- BEGIN VARIATIONS IMAGES (SLIDER) -->
                <div class="ecom__media">
                    <!-- Show first image only for B block; no slider is present. -->
                    <template v-if="blockViewMode === 'ecommerce_b' && activeProductImg.url">
                        <figure class="ecom__b-figure">
                            <img
                                :src="activeProductImg.url"
                                :alt="activeProductImg.alt"
                            >
                        </figure>
                        <figure v-if="activeProductImg.badge.discount_badge" class="ecom__b-discount">
                            <figcaption>-{{ activeProductImg.badge.promo_percentage }}%</figcaption>
                        </figure>
                        <figure v-else-if="activeProductImg.badge.promo_badge" class="ecom__b-promo">
                            <img :src="activeProductImg.badge.promo_badge">
                        </figure>
                    </template>
                    <template v-else>
                        <loader class="ecom__images-loader" />
                        <div
                            v-for="(variation, key, index) in product.variations"
                            :key="index"
                            class="ecom__images"
                            :data-variation="variation.id"
                        >
                            <slider v-show="variation.images && key == activeVariation" :images="variation.images" class="ecom__slider" />
                        </div>
                    </template>
                </div>
                <!-- END VARIATIONS IMAGES (SLIDER) -->

                <!-- BEGIN PRODUCT DATA -->
                <div class="ecom__data">
                    <info :product="product" :active-variation="activeVariation" class="ecom__info" />

                    <switcher
                        v-if="product.variations.length > 1"
                        :product="product"
                        :active-variation="activeVariation"
                        :instance="instance"
                        class="ecom__switcher"
                        @activeVariation="setActiveVariation"
                    />

                    <delivery-estimate
                        v-if="product.delivery_estimation.text && activeProduct.addToCart.disabled !== true"
                        :estimation="product.delivery_estimation"
                        class="ecom__delivery"
                    />

                    <add-to-cart :product="product" :active-variation="activeVariation" :type="'product'" class="ecom__atc" />

                    <available-at v-if="product.availableAt" :product="product" class="ecom__available" />

                    <div v-if="activeProduct.special_notice" class="ecom__special-notes-wrap">
                        <div class="ecom__special-notes ecom__special-notes--variation">
                            <special-notice
                                v-if="activeProduct.special_notice"
                                :variation="activeProduct"
                            />
                        </div>
                    </div>
                    <div
                        v-else-if="product.special_notice && !activeProduct.special_notice"
                        class="ecom__special-notes-wrap"
                    >
                        <div class="ecom__special-notes">
                            <div
                                v-for="(notice, key, index) in product.special_notice"
                                :key="index"
                                class="ecom__special-note"
                                v-html="notice.notice_text"
                            />
                        </div>
                    </div>

                    <perks
                        v-if="activeProduct.perks"
                        :variation="activeProduct"
                        class="ecom__perks"
                    />
                </div>
                <!-- END PRODUCT DATA -->
            </div>
        </div>
    </div>
</template>

<script>
import Loader from './Loader.vue';
import Slider from './Slider.vue';
import Info from './Info.vue';
import Switcher from './Switcher.vue';
import DeliveryEstimate from './DeliveryEstimate.vue';
import AddToCart from './AddToCart.vue';
import AvailableAt from './AvailableAt.vue';
import Perks from './Perks.vue';
import SpecialNotice from './SpecialNotice.vue';

export default {

    name: 'ProductView',

    components: {
        Loader,
        Slider,
        Info,
        Switcher,
        DeliveryEstimate,
        AddToCart,
        AvailableAt,
        Perks,
        SpecialNotice
    },

    props: {
        product: {
            type: Object,
            default: () => {}
        },
        instance: {
            type: String,
            default: ''
        },
        blockViewMode: {
            type: String,
            default: ''
        }
    },

    data () {
        return {
            activeVariation: 0,
            buy: {},
            activeProduct: this.product.variations[this.activeVariation],
            activeProductImg: this.activeProduct.images[0],
        };
    },

    methods: {
        setActiveVariation (response) {
            this.activeVariation = response.activeVariation;
        }
    }
};
</script>

<style lang="scss" src="../scss/perks.scss"></style>
