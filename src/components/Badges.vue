<template>
    <div>
        <figure v-if="badge.discount_badge" class="ecom__slider-discount">
            <figcaption>-{{ badge.discount_badge.promo_percentage }}%</figcaption>
        </figure>
        <figure v-if="badge.promo_badge" class="ecom__slider-promo">
            <img :src="badge.promo_badge">
        </figure>
        <figure v-else-if="badge.award_badge && !badge.promo_badge" class="ecom__slider-award">
            <img :src="badge.award_badge">
        </figure>
    </div>
</template>

<script>
export default {
    name: 'Badges',
    props: {
        badges: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            badge: this.badges.badge
        };
    },
    methods: {
    }
};
</script>

<style lang="scss" src="../scss/badges.scss"></style>
