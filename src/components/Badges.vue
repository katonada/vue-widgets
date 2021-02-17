<template>
    <div>
        <figure v-if="badges.badge.discount_badge" class="ecom__slider-discount">
            <figcaption>-{{ badges.badge.discount_badge.promo_percentage }}%</figcaption>
        </figure>
        <figure v-if="badges.badge.promo_badge" class="ecom__slider-promo">
            <img :src="badges.badge.promo_badge">
        </figure>
        <figure v-else-if="badges.badge.award_badge && !badges.badge.promo_badge" class="ecom__slider-award">
            <img :src="badges.badge.award_badge">
        </figure>
    </div>
</template>

<script>
export default {
    name: 'Badges',
    props: {
        badges: {
            type: Object,
        }
    },
    data () {
        return {
        };
    },
    methods: {
    }
};
</script>

<style lang="scss" src="../scss/badges.scss"></style>
