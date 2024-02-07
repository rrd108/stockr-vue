<template>
  <input
    type="text"
    v-model="rowFilterTerm"
    autocomplete="off"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  name: 'FilterInput',

  props: {
    search: {
      type: String,
      required: true
    },
    searchValue: {
      type: null,
      required: false
    },
    placeholder: String
  },

  data() {
    return {
      rowFilterTerm: this.$store.state.search[this.search]
    }
  },

  watch: {
    searchValue(val) {
      this.rowFilterTerm = val
    },
    rowFilterTerm(val) {
      this.$store.commit('setSearch', { field: this.search, val: val })
    }
  }
}
</script>

<style scoped></style>
