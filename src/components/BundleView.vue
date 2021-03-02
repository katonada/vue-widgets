<template>
    <div>
        <div :class="'ecom__wrap ecom__wrap--' + product.bundle">
            <div class="ecom__container">
                <!-- BEGIN VARIATIONS IMAGES (SLIDER) -->
                <div class="ecom__media">
                    <loader class="ecom__images-loader" />
                    <div
                        v-for="(variation, key, index) in product.variations"
                        :key="index"
                        class="ecom__images"
                        :data-variation="variation.id"
                    >
                        <slider v-show="activeImages.length && key == activeVariation" :images="activeImages" class="ecom__slider" />
                    </div>
                </div>
                <!-- END VARIATIONS IMAGES (SLIDER) -->

                <div class="ecom__data">
                    <info :product="product" :active-variation="activeVariation" class="ecom__info" />

                    <div v-if="product.variations.length" class="ecom__switcher">
                        <!-- BEGIN VARIATIONS (always 0 for bundles but we leave the possibility open) -->
                        <template v-for="variation in product.variations">
                            <!-- BEGIN PRODUCTS (devices that comprise bundle) -->
                            <div
                                v-for="(property, propertyKey, index) in variation.properties"
                                :key="index"
                                :class="'ecom__switcher-item ecom__switcher-item--'"
                            >

                                <!--BEGIN SWITCHER -->
                                <template v-if="property.variations.length">
                                    <h2 class="ecom__switcher-product-name">
                                        {{ property.title }}
                                    </h2>
                                    <h3 class="ecom__switcher-title">
                                        {{ property.variation_switcher_text }}:
                                        <span
                                            v-if="property.variations[activeDevices[propertyKey]].properties.id !== 'volume' &&
                                                property.variations[activeDevices[propertyKey]].properties.id !== 'country'"
                                        >
                                            {{ property.variations[activeDevices[propertyKey]].properties.label }}
                                        </span>
                                    </h3>


                                    <div class="ecom__switcher-dots">
                                        <label
                                            v-for="(propVariation, key, propIndex) in property.variations"
                                            :key="propIndex"
                                            :style="{ 'background-color': propVariation.properties.color }"
                                            :class="'ecom__switcher-dot ecom__switcher-dot--' + propVariation.id"
                                        >
                                            <input
                                                type="radio"
                                                :name="property.id + instance"
                                                :class="'id' + propVariation.id"
                                                :checked="key === 0"
                                                @change="
                                                    calculateCombination(
                                                        propertyKey,
                                                        propVariation.id,
                                                        key,
                                                        +propVariation.price.original.number
                                                    )
                                                "
                                            >
                                            <span
                                                v-if="propVariation.properties.id === 'volume' || propVariation.properties.id === 'country'"
                                                class="ecom__variation-name"
                                            >
                                                Label: {{ propVariation.properties.label }}
                                            </span>
                                            <span v-else />
                                        </label>
                                    </div>
                                </template>
                                <!--END SWITCHER -->
                            </div>
                            <!-- END PRODUCTS -->
                        </template>
                        <!-- END VARIATIONS -->
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
                        :bundle-price="+activePrices.reduce((a, b) => a + b)"
                        :active-combination="activeCombination"
                        class="ecom__atc"
                    />

                    <div v-if="productActive.special_notice" class="ecom__special-notes-wrap">
                        <div class="ecom__special-notes ecom__special-notes--variation">
                            <special-notice
                                v-if="productActive.special_notice"
                                :variation="productActive"
                            />
                        </div>
                    </div>
                    <div
                        v-else-if="product.special_notice && !productActive.special_notice"
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
                        v-if="productActive.perks"
                        :variation="productActive"
                        class="ecom__perks"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Perks from '@/components/Perks';
import DeliveryEstimate from '@/components/DeliveryEstimate';
import Info from '@/components/Info';
import Loader from './Loader.vue';
import AddToCart from './AddToCart.vue';
import Slider from './Slider.vue';
import SpecialNotice from './SpecialNotice';

export default {

    name: 'BundleView',

    components: {
        Loader,
        AddToCart,
        Perks,
        Slider,
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
            activeVariation: 0, // Will always be 0 for Bundles
            activeDevices: [0, 0, 0, 0, 0, 0, 0, 0],
            activePrices: [0, 0, 0, 0, 0, 0, 0, 0],
            activeCombination: [],
            activeImages: [],
            buy: {},
        };
    },

    computed: {

        productActive () {
            return this.product.variations[this.activeVariation] || { special_notice:'', perks: '' };
        },
    },

    created () {
        this.setInitialValues();
    },

    methods: {

        setInitialValues () {

            const product = this.product.variations[this.activeVariation];

            if (product.properties.length) {

                const tempCombination = [];
                product.properties.forEach((prop, index) => {

                    if (prop.variations.length) {
                        tempCombination.push(prop.variations[0].id);
                        this.activePrices[index] = prop.variations[0].price.original.number;
                    }
                });

                this.activeCombination = tempCombination;
                this.calculateCombination();
            }
        },

        calculateCombination (place, value, key, price) {

            this.activeDevices[place] = key;
            this.activeCombination[place] = value;
            this.activePrices[place] = price;
            this.activeImages = [];

            const { images } = this.product.variations[this.activeVariation];

            images.forEach(image => {

                const difference = image.product_combo.filter(combo => !this.activeCombination.includes(combo));
                if (difference.length < 1) this.activeImages.push(image);
            });

            // In case of content fail prevent slider link breaking
            if (!this.activeImages.length) {
                this.activeImages = [{
                    'badge': {
                        'discount_badge': null,
                        'promo_badge': null,
                        'award_badge': null
                    },
                    'url': 'https://assets.foreo.com/files/static/2021-01/slider404.png',
                    'alt': '404'
                }];
            }
            this.$forceUpdate();
        }
    }
};
</script>
