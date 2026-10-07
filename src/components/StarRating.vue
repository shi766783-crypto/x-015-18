<script setup>
import { computed, ref } from 'vue'
import { Star } from 'lucide-vue-next'
import { RATING_MAX } from '../composables/useRatings'

const props = defineProps({
  modelValue: { type: Number, default: null },
  max: { type: Number, default: RATING_MAX },
  readonly: { type: Boolean, default: false },
  size: { type: Number, default: 18 }
})
const emit = defineEmits(['update:modelValue'])
const hover = ref(0)
const display = computed(() => hover.value || props.modelValue || 0)
function choose(value) {
  if (props.readonly) return
  // 再次点击已选中的分数 = 清空评分（允许“未评分”状态）
  emit('update:modelValue', value === props.modelValue ? null : value)
}
</script>

<template>
  <span class="star-rating" :class="{ readonly }" @mouseleave="hover = 0">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      class="star-btn"
      :class="{ active: n <= display }"
      :aria-label="`${n} 星`"
      :tabindex="readonly ? -1 : 0"
      @click="choose(n)"
      @mouseenter="hover = readonly ? 0 : n"
    >
      <Star :size="size" :fill="n <= display ? 'currentColor' : 'none'" :stroke-width="n <= display ? 0 : 1.8" />
    </button>
  </span>
</template>
