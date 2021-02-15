<template>
  <div>
    <div class="ecom__available-title">{{ product.availableAt.title }}</div>
    <div class="ecom__available-items">
      <div
        v-for="(place, key, index) in product.availableAt.places"
        :key="index"
        :class="'ecom__available-place ecom__available-place--' + place.title"        
      >
        <a :href="place.url" class="ecom__available-link">
          <figure>
            <img v-if="place.image" :src="place.image.url" :alt="place.image.alt" />
          </figure>
          <span v-if="place.title">{{ place.title }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvailableAt",
  props: {
    product: {
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

<style lang="scss" src="../scss/availableat.scss"></style>