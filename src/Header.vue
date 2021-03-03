<template>
    <div>
        <h1>Header</h1>
        <span @click="setMQ">{{ greeting }}</span>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Header',

    data () {
        return {
            greeting: 'Hello'
        };
    },

    computed: {
        ...mapGetters(['getMQ']),
        // ...mapGetters('meta', ['main']),
    },

    created () {
    },

    methods: {
        ...mapActions(['setMQ']),
    }
};
</script>
