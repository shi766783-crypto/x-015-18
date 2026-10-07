<script setup>
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'
const props = defineProps({
  modelValue: { type: Number, default: null },
  size: { type: Number, default: 16 },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue'])
const hover = ref(0)
function choose(n) {
  if (props.readonly) return
  // 点击当前已选的同一颗星可清除评分（登记时允许暂不评分）
  emit('update:modelValue', props.clearable && props.modelValue === n ? null : n)
}
</script>
<template>
  <div class="star-rating" :class="{ readonly }" @mouseleave="hover = 0">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star"
      :class="{ active: n <= (hover || modelValue) }"
      :tabindex="readonly ? -1 : 0"
      :aria-label="`${n} 星`"
      @click="choose(n)"
      @mouseenter="!readonly && (hover = n)"
    ><Star :size="size" /></button>
  </div>
</template>
