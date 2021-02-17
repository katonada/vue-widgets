<template>
    <div>
        <div v-for="(perk, key, index) in variation.perks" :key="index" :class="'ecom__perk ecom__perk--' + perk.category">
            <figure class="ecom__perk-icon">
                <img :src="perk.icon">
            </figure>
            <div v-if="perk.title" class="ecom__perk-desc-wrap">
                <div v-if="perk.title" class="ecom__perk-title" v-html="perk.title" />
                <div v-if="perk.description" class="ecom__perk-desc" v-html="perk.description" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AvailableAt',
    props: {
        variation: {
            type: Object,
            default: () => {}
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

<style lang="scss" src="../scss/perks.scss"></style>
