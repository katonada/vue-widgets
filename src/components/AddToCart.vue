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
                        activeProduct.price.original.formatted.number !==
                            activeBundleTotalPrice[activeVariation]
                    "
                    class="ecom__price-multi"
                >
                    <p class="ecom__price-old">
                        {{ activeBundleTotalPrice[activeVariation] }}
                    </p>
                    <p class="ecom__price-discounted">
                        {{ activeProduct.price.original.formatted }}
                    </p>
                </div>
                <div v-else>
                    <p>oriđiđi cijena: {{ activeBundleTotalPrice[activeVariation] }}</p>
                </div>
            </template>
            <!-- END MASKS PRICE -->

            <!-- BEGIN PRODUCT PRICE -->
            <template v-else>
                <template v-if="activeProduct.price.discounted.formatted">
                    <div class="ecom__price-multi">
                        <div class="ecom__price-discounted">
                            {{ activeProduct.price.discounted.formatted }}
                        </div>
                        <div class="ecom__price-old">
                            {{ activeProduct.price.original.formatted }}
                        </div>
                    </div>
                    <div class="ecom__price-save">
                        <span>{{ activeProduct.price.discounted.savings.text }}</span>
                        {{ activeProduct.price.discounted.savings.formatted }}
                    </div>
                </template>

                <div v-else class="ecom__price-original">
                    {{ activeProduct.price.original.formatted }}
                </div>
            </template>
            <!-- END PRODUCT PRICE -->

            <!-- BEGIN VAT -->
            <div v-if="activeProduct.price.dach_vat" class="ecom__vat">
                {{ activeProduct.price.dach_vat.text }}
                <a :href="activeProduct.price.dach_vat.url" target="_blank">
                    {{ activeProduct.price.dach_vat.href_txt }}
                </a>
            </div>
            <!-- END VAT -->

            <!-- BEGIN INSTALLMENTS -->
            <div
                v-if="activeProduct.price.installments"
                class="ecom__installments"
                v-html="afterPayMarkup"
            />
            <afterPay-placement
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
                    activeProduct.addToCart.disabled &&
                        activeProduct.addToCart.id === 'sold_out'
                "
            >
                <div class="ecom__btn ecom__btn--disabled" v-html="activeProduct.addToCart.title" />
            </template>
            <template
                v-else-if="
                    activeProduct.addToCart.disabled &&
                        activeProduct.addToCart.id === 'buy_at'
                "
            >
                <a :href="activeProduct.addToCart.places.url" class="ecom__btn ecom__btn--buyat">
                    {{ activeProduct.addToCart.title }}
                    <figure v-if="activeProduct.addToCart.places.img">
                        <img :src="activeProduct.addToCart.places.img">
                    </figure>
                    <span v-else-if="activeProduct.addToCart.places.title">{{
                        activeProduct.addToCart.places.title
                    }}</span>
                </a>
            </template>
            <template
                v-if="
                    activeProduct.addToCart.disabled &&
                        activeProduct.addToCart.id === 'coming_soon'
                "
            >
                <div class="ecom__btn ecom__btn--disabled" v-html="activeProduct.addToCart.title" />
            </template>
            <template v-if="activeProduct.addToCart.id === 'buy_now'">
                <div
                    class="ecom__btn"
                    :class="{ 'ecom__btn--disabled': buttonDisabled }"
                    @click="generatePost"
                    v-html="activeProduct.addToCart.title"
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
import { apiServices } from '@/mixins/apiMixin';

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
            },
            activeProduct: this.product.variations[this.activeVariation]
        };
    },

    computed: {

        calculateSavings () {
            this.calculateBundlePrice();
            return this.bundleSavings;
        },

        formatBundlePrice () {

            let formatedBundlePrice = this.bundlePrice;
            const productOriginal = this.activeProduct.price.original;

            if (productOriginal.symbol) {
                if (productOriginal.position === 0) {
                    // formatedBundlePrice = String(productOriginal.symbol).concat(' ', String(formatedBundlePrice));
                    formatedBundlePrice = `${productOriginal.symbol} ${formatedBundlePrice}`;
                } else {
                    // formatedBundlePrice = String(formatedBundlePrice).concat(' ', String(productOriginal.symbol));
                    formatedBundlePrice = `${formatedBundlePrice} ${productOriginal.symbol}`;
                }
            }
            return formatedBundlePrice;
        },

        afterPayMarkup () {
            return '<div class="afterPay__installments"></div>';
        }
    },

    created () {

        this.checkInitialData();

        const productInstallments = this.activeProduct.price.installments;
        if (productInstallments && this.installmentsLoaded === false) this.initAfterPay();
    },

    updated () {
        const productInstallments = this.activeProduct.price.installments;
        if (productInstallments && this.installmentsLoaded === true) this.updateAfterPay();
    },

    methods: {

        checkInitialData () {
            /* INFO: zakomentirano od prije
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

            const productPrice = this.activeProduct.price;

            if (productPrice.discounted.formatted) {
                this.bundleFinalPrice = productPrice.discounted.formatted;
                this.bundleSavings = this.bundlePrice - (productPrice.original.number - productPrice.discounted.savings.number);
            } else {
                this.bundleFinalPrice = productPrice.original.formatted;
                this.bundleSavings = this.bundlePrice - productPrice.original.number;
            }

            // Format value & currency symbol
            if (productPrice.original.symbol) {
                if (productPrice.original.position === 0) {
                    // this.bundleSavings = String(productPrice.original.symbol).concat(' ', parseFloat((this.bundleSavings).toFixed(2)));
                    this.bundleSavings = `${productPrice.original.symbol} ${parseFloat((this.bundleSavings).toFixed(2))}`;
                } else {
                    // this.bundleSavings = parseFloat((this.bundleSavings).toFixed(2)).concat(' ', String(productPrice.original.symbol));
                    this.bundleSavings = `${parseFloat((this.bundleSavings).toFixed(2))} ${productPrice.original.symbol}`;
                }
            }
        },

        setBundleVariationsRefOptions () {

            const productVariation = this.activeProduct;
            let { bundleVariationsRefOptions } = this.post.data;
            bundleVariationsRefOptions = {};

            if (this.bundleType === 'default') {

                // let counter = 0;
                // for (const device of productVariation.properties) {
                //     bundleVariationsRefOptions[device.id] = {
                //         'productVarId': this.activeCombination[counter],
                //         'qta': device.quantity
                //     };
                //     console.log(device);
                //     counter++;
                // }

                productVariation.properties.forEach(({ id, quantity }, index) => {
                    bundleVariationsRefOptions[id] = {
                        'productVarId': this.activeCombination[index],
                        'qta': quantity
                    };
                });

            } else if (this.bundleType === 'masks') {

                productVariation.properties.forEach(({ id, variations, quantity }) => {
                    bundleVariationsRefOptions[id] = {
                        'productVarId': variations[0].id,
                        'qta': quantity
                    };
                });
            }
        },

        initAfterPay () {

            const productVariation = this.activeProduct;
            const productLibraries = Object.values(productVariation.price.installments.properties.libraries);

            productLibraries.forEach (library => {
                const script = document.createElement('script');
                script.setAttribute('src', productLibraries[library]);
                document.head.appendChild(script);
            });


            setTimeout(() => {
                this.installmentsLoaded = true;
                this.updateAfterPay();
            }, 2000);
        },

        updateAfterPay () {

            if (document.querySelector('.afterPay-paragraph')) document.querySelector('.afterPay-paragraph').remove();

            const productInstallments = this.activeProduct.price.installments;
            const config = productInstallments.properties.conf;

            // eslint-disable-next-line new-cap
            if (productInstallments.type === 'afterPay_us' || productInstallments.type === 'afterPay_au') new window.presentAfterPay(config).init();

            if (productInstallments.type === 'moip') this.initMoip();

            if (productInstallments.type === 'clearpay') {
                this.clearpayLoaded = productInstallments.properties.clearpay_additional.afterPay_placement;

                if (this.clearpayLoaded) {
                    this.clearpay.dataLocale = this.clearpayLoaded.data_locale;
                    this.clearpay.dataCurrency = this.clearpayLoaded.data_currency;
                    this.clearpay.dataAmount = this.clearpayLoaded.data_amount;
                }
            }
        },

        initMoip () {
            this.moipLoaded = this.activeProduct.price.installments.properties.value;
        },

        generatePost () {
            this.buttonDisabled = true;

            this.setBundleVariationsRefOptions();
            this.post.data.purchasedEntityId = this.activeProduct.id;

            apiServices.get(process.env.VUE_APP_TOKEN,
                {
                    headers: {
                        'X-Foreo-Source': process.env.VUE_APP_HASH,
                        'Accept-Language': window.drupalSettings.path.currentLanguage
                    }
                })
                .then(response => {
                    this.addToCart(response.data.data.attributes);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        addToCart (token) {
            this.popupContent = '';

            const $form = JSON.stringify(this.post);
            apiServices.post(process.env.VUE_APP_POST, $form,
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
            const errResponse = error.response.data.errors[0];

            if (errResponse.detail) {
                this.popupContent = errResponse.detail;
            } else if (error.response.data.errors) {
                this.popupContent = error.response.data.errors;
            }
            console.log(error);
        }
    }
};
</script>

<style lang="scss" src="../scss/addtocart.scss"></style>
