<template>
    <div>
        <!-- BEGIN PRICE -->
        <div class="ecom__price">
            <!-- BEGIN BUNDLE PRICE -->
            <template v-if="bundleType === 'default'">
                <div class="ecom__price-multi">
                    <div class="ecom__price-discounted">
                        {{ bundleFinalPrice }}
                    </div>
                    <div class="ecom__price-old">
                        {{ formatBundlePrice }}
                    </div>
                </div>
                <div class="ecom__price-save">
                    <span>SAVE</span>
                    {{ calculateSavings }}
                </div>
            </template>
            <!-- END BUNDLE PRICE -->

            <!-- BEGIN MASKS PRICE -->
            <template v-else-if="bundleType === 'masks'">
                <div
                    v-if="
                        product.variations[activeVariation].price.original.formatted.number !==
                            activeBundleTotalPrice[activeVariation]
                    "
                    class="ecom__price-multi"
                >
                    <p class="ecom__price-old">
                        {{ activeBundleTotalPrice[activeVariation] }}
                    </p>
                    <p class="ecom__price-discounted">
                        {{ product.variations[activeVariation].price.original.formatted }}
                    </p>
                </div>
                <div v-else>
                    <p>oriđiđi cijena: {{ activeBundleTotalPrice[activeVariation] }}</p>
                </div>
            </template>
            <!-- END MASKS PRICE -->

            <!-- BEGIN PRODUCT PRICE -->
            <template v-else>
                <template v-if="product.variations[activeVariation].price.discounted.formatted">
                    <div class="ecom__price-multi">
                        <div class="ecom__price-discounted">
                            {{ product.variations[activeVariation].price.discounted.formatted }}
                        </div>
                        <div class="ecom__price-old">
                            {{ product.variations[activeVariation].price.original.formatted }}
                        </div>
                    </div>
                    <div class="ecom__price-save">
                        <span>{{ product.variations[activeVariation].price.discounted.savings.text }}</span>
                        {{ product.variations[activeVariation].price.discounted.savings.formatted }}
                    </div>
                </template>

                <div v-else class="ecom__price-original">
                    {{ product.variations[activeVariation].price.original.formatted }}
                </div>
            </template>
            <!-- END PRODUCT PRICE -->

            <!-- BEGIN VAT -->
            <div v-if="product.variations[activeVariation].price.dach_vat" class="ecom__vat">
                {{ product.variations[activeVariation].price.dach_vat.text }}
                <a :href="product.variations[activeVariation].price.dach_vat.url" target="_blank">
                    {{ product.variations[activeVariation].price.dach_vat.href_txt }}
                </a>
            </div>
            <!-- END VAT -->

            <!-- BEGIN INSTALLMENTS -->
            <div
                v-if="product.variations[activeVariation].price.installments"
                class="ecom__installments"
                v-html="afterpayMarkup"
            />
            <afterpay-placement
                v-if="clearpayLoaded"
                class="clearpay-wrap"
                :data-locale="clearpay.dataLocale"
                :data-currency="clearpay.dataCurrency"
                :data-amount="clearpay.dataAmount"
            />
            <span v-if="moipLoaded" class="ecom__installments-moip" v-html="moipLoaded" />
            <!-- END INSTALLMENTS -->
        </div>
        <!-- END PRICE -->

        <!-- BEGIN BUY BUTTON -->
        <div class="ecom__atc-buy">
            <template
                v-if="
                    product.variations[activeVariation].addToCart.disabled &&
                        product.variations[activeVariation].addToCart.id === 'sold_out'
                "
            >
                <div class="ecom__btn ecom__btn--disabled" v-html="product.variations[activeVariation].addToCart.title" />
            </template>
            <template
                v-else-if="
                    product.variations[activeVariation].addToCart.disabled &&
                        product.variations[activeVariation].addToCart.id === 'buy_at'
                "
            >
                <a :href="product.variations[activeVariation].addToCart.places.url" class="ecom__btn ecom__btn--buyat">
                    {{ product.variations[activeVariation].addToCart.title }}
                    <figure v-if="product.variations[activeVariation].addToCart.places.img">
                        <img :src="product.variations[activeVariation].addToCart.places.img">
                    </figure>
                    <span v-else-if="product.variations[activeVariation].addToCart.places.title">{{
                        product.variations[activeVariation].addToCart.places.title
                    }}</span>
                </a>
            </template>
            <template
                v-if="
                    product.variations[activeVariation].addToCart.disabled &&
                        product.variations[activeVariation].addToCart.id === 'coming_soon'
                "
            >
                <div class="ecom__btn ecom__btn--disabled" v-html="product.variations[activeVariation].addToCart.title" />
            </template>
            <template v-if="product.variations[activeVariation].addToCart.id === 'buy_now'">
                <div
                    class="ecom__btn"
                    :class="{ 'ecom__btn--disabled': buttonDisabled }"
                    @click="generatePost"
                    v-html="product.variations[activeVariation].addToCart.title"
                />
            </template>
        </div>
        <!-- END BUY BUTTON -->

        <!-- BEGIN POPUP WINDOW -->
        <div v-if="popup" class="ecom__popup">
            <div class="ecom__popup-inner">
                <div class="ecom__popup-content">
                    {{ popupContent }}
                </div>
                <div class="ecom__popup-btn" @click="(popup = false), (buttonDisabled = false)">
                    X
                </div>
            </div>
        </div>
    <!-- END POPUP WINDOW -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddToCart',
    props: {
        product: {
            type: Object,
            default: () => {}
        },
        type: {
            type: String,
            default: ''
        },
        activeVariation: {
            type: Number,
            default: null
        },
        activeCombination: {
            type: Array,
            default: () => []
        },
        bundlePrice: {
            type: Number,
            default: null
        },
        activeBundleTotalPrice: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            bundleFinalPrice: 0,
            bundleSavings: 0,
            popup: false,
            popupContent: false,
            buttonDisabled: false,
            installmentsLoaded: false,
            moipLoaded: false,
            clearpayLoaded: false,
            clearpay: {
                dataLocale: '',
                dataCurrency: '',
                dataAmount: ''
            },
            bundleType: '',
            post: {
                data: {
                    purchasedEntityId: 0,
                    type: '',
                    bundleVariationsRefOptions: null
                }
            }
        };
    },
    computed: {
        calculateSavings () {
            this.calculateBundlePrice();
            return this.bundleSavings;
        },
        formatBundlePrice () {
            let formatedBundlePrice = this.$props.bundlePrice;
            if (this.product.variations[this.$props.activeVariation].price.original.symbol) {
                if (this.product.variations[this.$props.activeVariation].price.original.position === 0) {
                    formatedBundlePrice = String(this.product.variations[this.$props.activeVariation].price.original.symbol).concat(' ', String(formatedBundlePrice));
                } else {
                    formatedBundlePrice = String(formatedBundlePrice).concat(' ', String(this.product.variations[this.$props.activeVariation].price.original.symbol));
                }
            }
            return formatedBundlePrice;
        },
        afterpayMarkup () {
            return '<div class="afterpay__installments"></div>';
        }
    },
    beforeMount () {
        this.checkInitialData();
        if (this.product.variations[this.activeVariation].price.installments && this.installmentsLoaded === false) this.initAfterpay();
    },
    updated () {
        if (this.product.variations[this.activeVariation].price.installments && this.installmentsLoaded === true) this.updateAfterpay();
    },
    methods: {
        checkInitialData () {
            /*
            if (this.type === 'bundle' && this.product.bundle === 'default') {
                this.post.data.type = 'product_bundle'
                this.bundleType = 'default'
            } else if (this.type === 'bundle' && this.product.bundle === 'masks') {
                this.post.data.type = 'product_bundle'
                this.bundleType = 'masks'
            } else if (this.type === 'product') {
                this.post.data.type = 'product'
            }
            */
        },
        calculateBundlePrice () {
            if (this.product.variations[this.$props.activeVariation].price.discounted.formatted) {
                this.bundleFinalPrice = this.$props.product.variations[this.$props.activeVariation].price.discounted.formatted;
                this.bundleSavings = this.$props.bundlePrice - (this.$props.product.variations[this.$props.activeVariation].price.original.number - this.$props.product.variations[this.$props.activeVariation].price.discounted.savings.number);
            } else {
                this.bundleFinalPrice = this.$props.product.variations[this.$props.activeVariation].price.original.formatted;
                this.bundleSavings = this.$props.bundlePrice - this.$props.product.variations[this.$props.activeVariation].price.original.number;
            }
            // Format value & currency symbol
            if (this.product.variations[this.$props.activeVariation].price.original.symbol) {
                if (this.product.variations[this.$props.activeVariation].price.original.position === 0) {
                    this.bundleSavings = String(this.product.variations[this.$props.activeVariation].price.original.symbol).concat(' ', parseFloat((this.bundleSavings).toFixed(2)));
                } else {
                    this.bundleSavings = parseFloat((this.bundleSavings).toFixed(2)).concat(' ', String(this.product.variations[this.$props.activeVariation].price.original.symbol));
                }
            }
        },
        setBundleVariationsRefOptions () {

            if (this.bundleType === 'default') {
                let counter = 0;
                this.post.data.bundleVariationsRefOptions = {};
                for (const device of this.product.variations[this.$props.activeVariation].properties) {
                    this.post.data.bundleVariationsRefOptions[device.id] = {
                        'productVarId': this.activeCombination[counter],
                        'qta': device.quantity
                    };
                    counter++;
                }
            } else if (this.bundleType === 'masks') {
                this.post.data.bundleVariationsRefOptions = {};
                for (const device of this.product.variations[this.$props.activeVariation].properties) {
                    this.post.data.bundleVariationsRefOptions[device.id] = {
                        'productVarId': device.variations[0].id,
                        'qta': device.quantity
                    };
                }
            }
        },
        initAfterpay () {
            for (const library in this.product.variations[this.activeVariation].price.installments.properties.libraries) {
                const script = document.createElement('script');
                script.setAttribute('src', this.product.variations[this.activeVariation].price.installments.properties.libraries[library]);
                document.head.appendChild(script);
            }
            setTimeout(() => {
                this.installmentsLoaded = true;
                this.updateAfterpay();
            }, 2000);
        },
        updateAfterpay () {
            if (document.querySelector('.afterpay-paragraph')) document.querySelector('.afterpay-paragraph').remove();
            const config = this.product.variations[this.activeVariation].price.installments.properties.conf;
            if (this.product.variations[this.activeVariation].price.installments.type === 'afterpay_us' || this.product.variations[this.activeVariation].price.installments.type === 'afterpay_au') new window.presentAfterpay(config).init();
            if (this.product.variations[this.activeVariation].price.installments.type === 'moip') this.initMoip();
            if (this.product.variations[this.activeVariation].price.installments.type === 'clearpay') {
                this.clearpayLoaded = this.product.variations[this.activeVariation].price.installments.properties.clearpay_additional.afterpay_placement;
                this.clearpay.dataLocale = this.clearpayLoaded.data_locale;
                this.clearpay.dataCurrency = this.clearpayLoaded.data_currency;
                this.clearpay.dataAmount = this.clearpayLoaded.data_amount;
            }
        },
        initMoip () {
            this.moipLoaded = this.product.variations[this.activeVariation].price.installments.properties.value;
        },
        generatePost () {
            this.buttonDisabled = true;
            this.setBundleVariationsRefOptions();
            this.post.data.purchasedEntityId = this.product.variations[this.activeVariation].id;
            axios
                .get(process.env.VUE_APP_TOKEN,
                    {
                        headers: {
                            'X-Foreo-Source': process.env.VUE_APP_HASH,
                            'Accept-Language': window.drupalSettings.path.currentLanguage
                        }
                    })
                .then(response => {
                    this.adToCart(response.data.data.attributes);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        adToCart (token) {
            this.popupContent = '';
            const $form = JSON.stringify(this.post);
            axios
                .post(process.env.VUE_APP_POST, $form,
                    {
                        headers: {
                            'X-Foreo-Source': process.env.VUE_APP_HASH,
                            'Authorization': `Bearer ${ token}`,
                            'Accept-Language': window.drupalSettings.path.currentLanguage,
                            'Content-Type': 'application/json'
                        }
                    })
                .then(response => {
                    this.responseHandling(response.data);
                })
                .catch(error => {
                    this.errorHandling(error);
                });
        },
        responseHandling (data) {
            // this.popup = true
            // this.buttonDisabled = false
            this.popupContent = data.detail;
            if (data.datalayer_data) window.dataLayer.push(data.datalayer_data);
            window.location.href = '/cart';
        },
        errorHandling (error) {
            this.popup = true;
            if (error.response.data.errors[0].detail) {
                this.popupContent = error.response.data.errors[0].detail;
            } else if (error.response.data.errors) {
                this.popupContent = error.response.data.errors;
            }
            console.log(error);
        }
    }
};
</script>

<style lang="scss" src="../scss/addtocart.scss"></style>
