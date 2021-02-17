<template>
    <div>
        <div
            v-if="product.title" :class="[{ js_active: activeDescription }, 'ecom__info-title']"
            @click="activeDescription = !activeDescription"
            v-html="product.title"
        />
        <div
            v-if="product.variations[activeVariation].contains"
            class="ecom__info-contains"
            v-html="product.variations[activeVariation].contains"
        />
        <div :class="[{ js_active: activeDescription }, 'ecom__info-description-wrap']">
            <div v-if="product.subtitle" class="ecom__info-subtitle" v-html="product.subtitle" />
            <div v-if="product.description" class="ecom__info-description" v-html="product.description" />
        </div>
        <div v-if="product.worksWith" class="ecom__info-works-with">
            <p class="ecom__info-works-with-label">
                Works with:
            </p>
            <!-- todo: replace with real translatable string. -->
            <div v-for="(item, key, index) in product.worksWith" :key="index" class="ecom__info-works-with-item">
                <span class="ecom__info-works-with-icon" :style="{ color: item.icon_color }" />
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Info',
    props: {
        product: {
            type: Object,
            default: () => {}
        },
        activeVariation: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            activeDescription: false
        };
    },
    beforeMount () {
        this.checkBazaarVoice();
    },
    methods: {
        checkBazaarVoice () {
            const timer = setInterval(() => {
                if (document.querySelector('.bv_stars_button_container')) {
                    document.querySelector('.ecom__info-title').appendChild(document.querySelector('.bv_stars_button_container'));
                    clearInterval(timer);
                }
            }, 1000);
        }
    }
};
</script>

<style lang="scss" src="../scss/info.scss"></style>
