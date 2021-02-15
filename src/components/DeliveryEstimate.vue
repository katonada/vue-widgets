<template>
  <div>
    {{ estimation.text }}
    <strong v-if="estimation.country_name"> {{ estimation.country_name }}: </strong>
    <span v-if="estimation.date">{{ estimation.date }}</span>
  </div>
</template>

<script>
export default {
  name: "DeliveryEstimate",
  props: {
    estimation: {
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

<style lang="scss" src="../scss/deliveryestimate.scss"></style>