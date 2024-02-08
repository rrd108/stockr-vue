<script setup>
  const props = defineProps({
    placeholder: {
      type: String,
    },
  })
  const filter = defineModel()
</script>

<template>
  <input type="text" v-model="filter" autocomplete="off" :placeholder="placeholder" />
</template>

<style scoped></style>
