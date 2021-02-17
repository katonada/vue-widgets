<template>
    <div>
        <!-- BEGIN VERTICAL SLIDER -->
        <vue-slick-carousel
            v-bind="sliderVerticalSettings"
            ref="sliderVertical"
            :as-nav-for="sliderMain"
            class="slider-vertical"
            :class="{ 'slider-vertical--disabled': images.length <= 1 }"
        >
            <div v-for="(image, key, index) in images" :key="index" class="ecom__slider-item">
                <figure v-if="image.url" class="ecom__slider-figure">
                    <img :src="image.url" :alt="image.alt">
                </figure>
            </div>
        </vue-slick-carousel>
        <!-- END VERTICAL SLIDER -->

        <!-- BEGIN MAIN SLIDER -->
        <vue-slick-carousel
            v-if="images.length"
            v-bind="sliderMainSettings"
            ref="sliderMain"
            :as-nav-for="sliderVertical"
            class="slider-main"
        >
            <div v-for="(image, key, index) in images" :key="index" class="ecom__slider-item">
                <figure v-if="image.url" class="ecom__slider-figure">
                    <img :src="image.url" :alt="image.alt">
                </figure>
                <Badges :badges="image" class="ecom__slider-badges" />
            </div>
        </vue-slick-carousel>
    <!-- END MAIN SLIDER -->
    </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import Badges from './Badges.vue';

export default {
    name: 'Slider',
    components: {
        VueSlickCarousel,
        Badges
    },
    props: {
        images: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            sliderMain: undefined,
            sliderVertical: undefined,
            sliderMainSettings: {
                slidesToShow: 1,
                fade: true,
                arrows: false,
                dots: false,
                speed: 250,
                // mobileFirst: true,
                responsive: [
                    {
                        breakpoint: 767,
                        settings: {
                            arrows: true
                        }
                    }
                ]
            },
            sliderVerticalSettings: {
                slidesToShow: 4,
                centerMode: true,
                focusOnSelect: true,
                arrows: false,
                dots: false,
                speed: 250,
                vertical: true,
                verticalSwiping: true,
                mobileFirst: true
            }
        };
    },
    mounted () {
        this.sliderMain = this.$refs.sliderMain;
        this.sliderVertical = this.$refs.sliderVertical;
    },
    methods: {
    }
};
</script>

<style lang="scss" src="../scss/slider.scss"></style>
