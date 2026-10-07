import { computed, reactive } from 'vue'
import { createStorage } from '../services/storage'
import { config, normalizeScore, seed } from '../data'

const storage = createStorage(config.storageKey, seed)
export function useKeeper() {
  const state = reactive(storage.read())
  const persist = () => storage.write(state)
  const add = (collection, item) => { state[collection].unshift({ id: `${collection}-${Date.now()}`, createdAt: new Date().toISOString(), ...item }); persist() }
  const update = (collection, id, patch) => { const item = state[collection].find((entry) => entry.id === id); if (item) Object.assign(item, patch); persist() }
  const remove = (collection, id) => { state[collection] = state[collection].filter((entry) => entry.id !== id); persist() }
  // 评分统一入口：所有星级写入都在这里做 1~5 范围校验，
  // 越界 / 清空都会被规范化为 null（未评分），不会污染平均分
  const rateUsage = (id, score) => {
    const item = state.usages.find((entry) => entry.id === id)
    if (!item) return
    item.score = normalizeScore(score)
    persist()
  }
  const reset = () => { Object.assign(state, structuredClone(seed)); persist() }
  const metrics = computed(() => config.metrics.map((metric) => ({ ...metric, value: metric.value ? metric.value(state) : state[metric.collection]?.length || 0, hint: typeof metric.hint === 'function' ? metric.hint(state) : '' })))
  return { state, add, update, remove, rateUsage, reset, persist, metrics }
}
