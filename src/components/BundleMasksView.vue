<template>
    <div>
        <div :class="'ecom__wrap ecom__wrap--' + product.bundle">
            <div class="ecom__container">
                <div class="ecom__media">
                    <loader class="ecom__images-loader" />
                    <div
                        v-for="(variation, key, index) in product.variations"
                        :key="index"
                        class="ecom__images"
                        :data-variation="variation.id"
                    >
                        <slider v-show="variation.images && key == activeVariation" :images="variation.images" class="ecom__slider" />
                    </div>
                </div>

                <div class="ecom__data">
                    <info :product="product" :active-variation="activeVariation" class="ecom__info" />

                    <div v-if="product.variations" class="ecom__switcher">
                        <h3 class="ecom__switcher-title">
                            {{ product.variation_switcher_text }}:{{ activeProduct.properties.label }}
                        </h3>
                        <div class="ecom__variations">
                            <label v-for="(variation, key, index) in product.variations" :key="index" class="ecom__variation">
                                <input
                                    id="bundle-variation"
                                    type="radio"
                                    :name="product.id + instance"
                                    :class="'id' + variation.id + ' ecom__variation-radio'"
                                    :checked="key === 0"
                                    @change="activeVariation = key"
                                >
                                <div class="ecom__variation-name">
                                    <span class="ecom__variation-title">{{ variation.title }}</span>
                                    <div v-if="activeBundleSavings[key] != 0.0" class="ecom__savings-wrap">
                                        <span class="ecom__savings-text">
                                            SAVE
                                            <!-- @todo: replace with real translatable Drupal string --></span>
                                        <span class="ecom__savings-amount">{{ activeBundleSavings[key] }}</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <delivery-estimate
                        v-if="product.delivery_estimation.text"
                        :estimation="product.delivery_estimation"
                        class="ecom__delivery"
                    />

                    <add-to-cart
                        :product="product"
                        :active-variation="activeVariation"
                        :type="'bundle'"
                        :active-bundle-total-price="activeBundleTotalPrice"
                        class="ecom__atc"
                    />

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
            </div>
        </div>
    </div>
</template>

<script>
import Loader from './Loader.vue';
import Slider from './Slider.vue';
import AddToCart from './AddToCart.vue';
import Perks from './Perks.vue';
import DeliveryEstimate from './DeliveryEstimate.vue';
import Info from './Info.vue';
import SpecialNotice from './SpecialNotice';

export default {
    name: 'ProductView',
    components: {
        Loader,
        Slider,
        AddToCart,
        Perks,
        DeliveryEstimate,
        Info,
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
        }
    },
    data () {
        return {
            activeProduct: this.product.variations[this.activeVariation],
            activeVariation: 0,
            buy: {},
            activeBundleSavings: [0, 0, 0, 0, 0, 0, 0, 0],
            activeBundleTotalPrice: [0, 0, 0, 0, 0, 0, 0, 0]
        };
    },

    created () {
        this.calculateSavings();
    },

    methods: {

        calculateSavings () {

            if (this.activeProduct.properties.length) {

                // for (let i = 0; i < this.product.variations.length; i++) {
                //     const maskQuantity = this.product.variations[i].properties[0].quantity;
                //     const maskBundlePrice = this.product.variations[i].price.original.number;
                //     const maskOriginalPrice = this.product.variations[i].properties[0].variations[0].price.original.number;

                //     const bundleSavings = (maskBundlePrice - (maskOriginalPrice) * maskQuantity).toFixed(2);

                //     // Savings is negative value so we subtract it from bundle price to get total value.
                //     const totalBundlePrice = maskBundlePrice - bundleSavings;

                //     this.activeBundleSavings[i] = bundleSavings;

                //     this.activeBundleTotalPrice[i] = totalBundlePrice;
                // }

                this.product.variations.forEach((product, index) => {
                    const maskBundlePrice = product.price.original.number;
                    const maskOriginalPrice = product.properties[0].variations[0].price.original.number;
                    const maskQuantity = product.properties[0].quantity;

                    const bundleSavings = (maskBundlePrice - (maskOriginalPrice) * maskQuantity).toFixed(2);

                    // Savings is negative value so we subtract it from bundle price to get total value.
                    const totalBundlePrice = maskBundlePrice - bundleSavings;

                    this.activeBundleSavings[index] = bundleSavings;
                    this.activeBundleTotalPrice[index] = totalBundlePrice;
                });
            }
        }
    },
};
</script>

<style lang="scss" src="../scss/specialnotice.scss"></style>
