<template>
    <div>
        <div v-for="(notice, key, index) in variation.special_notice" :key="index" class="ecom__special-note">
            <div v-html="notice.notice_text" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpecialNotice',
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
