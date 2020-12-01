<template>
  <div>
    <span @click="setForEdit(propName)" v-show="editProductProperty != propName">#{{product[propName]}}</span>
    <input type="text" @blur="edit(propName)" v-model="product[propName]" v-show="editProductProperty == propName">
  </div>
</template>

<script>
export default {
  name: 'InlineEditInput',
  props: ['propName']
}
</script>
