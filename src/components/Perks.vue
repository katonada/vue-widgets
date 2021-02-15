<template>
  <div>
    <div v-for="(perk, key, index) in variation.perks" :key="index" :class="'ecom__perk ecom__perk--' + perk.category">
      <figure class="ecom__perk-icon">
        <img :src="perk.icon" />
      </figure>
      <div v-if="perk.title" class="ecom__perk-desc-wrap">
        <div v-if="perk.title" v-html="perk.title" class="ecom__perk-title"></div>
        <div v-if="perk.description" v-html="perk.description" class="ecom__perk-desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvailableAt",
  props: {
    variation: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" src="../scss/perks.scss"></style>
