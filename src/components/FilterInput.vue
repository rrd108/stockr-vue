<template>
    <input type="text" v-model="rowFilter" autocomplete="off" placeholder="Search">
</template>

<script>
export default {
    name: 'FilterInput',

    data() {
        return {
            rowFilter: '',
        }
    },

    watch: {
        rowFilter(val) {
            this.$emit('row-filter', val)
        }
    }
}
</script>

<style scoped>
</style>