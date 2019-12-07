<template>
    <input type="text" v-model="filterRow" autocomplete="off" placeholder="Search">
</template>

<script>
export default {
    name: 'FilterInput',

    data() {
        return {
            filterRow: '',
        }
    },

    watch: {
        filterRow(val) {
            this.$emit('row-filter', val)
        }
    }
}
</script>

<style scoped>
</style>