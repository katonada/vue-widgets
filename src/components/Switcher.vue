<template>
    <div>
        <h3 v-if="product.variation_switcher_text && product.variations" class="ecom__switcher-title">
            {{ product.variation_switcher_text }}:
            <span v-if="product.bundle !== 'cleanser' && product.bundle !== 'charger'">
                {{ product.variations[activeVariation].properties.label }}
            </span>
        </h3>
        <div class="ecom__switcher-dots">
            <label
                v-for="(variation, key, index) in product.variations"
                :key="index"
                :style="{ 'background-color': variation.properties.color }"
                :class="'ecom__switcher-dot ecom__switcher-dot--' + variation.id"
            >
                <input
                    type="radio"
                    :name="product.id + instance"
                    :class="'id' + variation.id"
                    :checked="key === 0"
                    @change="emitActiveVariation(key)"
                >
                <span v-if="product.bundle === 'cleanser' || product.bundle === 'charger'" class="ecom__variation-name">
                    {{ variation.properties.label }}
                </span>
                <span v-else />
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Switcher',
    props: {
        product: {
            type: Object,
            default: () => {}
        },
        activeVariation: {
            type: Number,
            default: null
        },
        instance: {
            type: String,
            default: ''
        },
    },
    data () {
        return {
        };
    },
    methods: {
        emitActiveVariation (key) {
            this.$emit('activeVariation', { activeVariation: key });
        }
    }
};
</script>

<style lang="scss" src="../scss/switcher.scss"></style>
