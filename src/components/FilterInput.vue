<template>
    <input type="text" v-model="rowFilter" autocomplete="off" placeholder="Search">
</template>

<script>
export default {
    name: 'FilterInput',

    props : {
        search: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            rowFilter: this.$store.state.search[this.search],
        }
    },

    watch: {
        rowFilter(val) {
            this.$store.commit('setSearch', {field: this.search, val: val});
        }
    }
}
</script>

<style scoped>
</style>