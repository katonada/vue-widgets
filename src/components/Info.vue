<template>
  <div>
    <div
      v-if="product.title" v-html="product.title"
      v-bind:class="[{ js_active: activeDescription }, 'ecom__info-title']"
      v-on:click="activeDescription = !activeDescription"
    ></div>
    <div
      v-if="product.variations[activeVariation].contains"
      v-html="product.variations[activeVariation].contains"
      class="ecom__info-contains"
    ></div>
    <div v-bind:class="[{ js_active: activeDescription }, 'ecom__info-description-wrap']">
      <div v-if="product.subtitle" v-html="product.subtitle" class="ecom__info-subtitle"></div>
      <div v-if="product.description" v-html="product.description" class="ecom__info-description"></div>
    </div>
    <div v-if="product.worksWith" class="ecom__info-works-with">
      <p class="ecom__info-works-with-label">Works with:</p>
      <!-- todo: replace with real translatable string. -->
      <div v-for="(item, key, index) in product.worksWith" :key="index" class="ecom__info-works-with-item">
        <span class="ecom__info-works-with-icon" :style="{ color: item.icon_color }"></span>
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Info",
  props: {
    product: {
      type: Object,
    },
    activeVariation: {
      type: Number
    }
  },
  data() {
    return {
      activeDescription: false
    }
  },
  methods: {
    checkBazaarVoice() {
      const timer = setInterval(() => {
        if (document.querySelector('.bv_stars_button_container')) {
          document.querySelector('.ecom__info-title').appendChild(document.querySelector('.bv_stars_button_container'))
          clearInterval(timer);
        }
      }, 1000)
    }
  },
  beforeMount() {
    this.checkBazaarVoice()
  }
};
</script>

<style lang="scss" src="../scss/info.scss"></style>
