<template>
  <span class="vue-quick-edit" @click="startEdit">
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="editValue"
      @blur="save"
      @keyup.enter="save"
      @keyup.esc="cancel"
      class="quick-edit-input"
    />
    <span v-else class="quick-edit-display">
      {{ displayValue }}
    </span>
  </span>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

export default {
  name: 'QuickEdit',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    buttonCancelText: {
      type: String,
      default: 'X',
    },
    emptyText: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'input'],
  setup(props, { emit }) {
    const isEditing = ref(false)
    const editValue = ref('')
    const inputRef = ref(null)

    const displayValue = computed(() => {
      if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
        return props.emptyText || ''
      }
      return props.modelValue
    })

    const startEdit = () => {
      isEditing.value = true
      editValue.value = props.modelValue || ''
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus()
          inputRef.value.select()
        }
      })
    }

    const save = () => {
      isEditing.value = false
      emit('update:modelValue', editValue.value)
      emit('input', editValue.value)
    }

    const cancel = () => {
      isEditing.value = false
      editValue.value = props.modelValue || ''
    }

    watch(() => props.modelValue, (newValue) => {
      if (!isEditing.value) {
        editValue.value = newValue || ''
      }
    })

    return {
      isEditing,
      editValue,
      inputRef,
      displayValue,
      startEdit,
      save,
      cancel,
    }
  },
}
</script>

<style scoped>
.vue-quick-edit {
  display: inline-block;
  cursor: pointer;
  min-width: 50px;
}

.quick-edit-display {
  padding: 2px 4px;
  border-bottom: 1px dashed #999;
  display: inline-block;
  min-height: 1em;
}

.quick-edit-display:hover {
  background-color: #ffc;
}

.quick-edit-input {
  padding: 2px 4px;
  border: 1px solid #999;
  outline: none;
  font-size: inherit;
  font-family: inherit;
  min-width: 100px;
}
</style>

