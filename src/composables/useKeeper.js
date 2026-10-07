import { computed, reactive } from 'vue'
import { createStorage } from '../services/storage'
import { config, seed } from '../data'
import { normalizeScore } from './useRatings'

const storage = createStorage(config.storageKey, seed)
export function useKeeper() {
  const state = reactive(storage.read())
  const persist = () => storage.write(state)
  const add = (collection, item) => {
    const next = { id: `${collection}-${Date.now()}`, createdAt: new Date().toISOString(), ...item }
    if (collection === 'usages') next.score = normalizeScore(next.score)
    state[collection].unshift(next)
    persist()
  }
  const update = (collection, id, patch) => { const item = state[collection].find((entry) => entry.id === id); if (item) Object.assign(item, patch); persist() }
  // 给烹饪记录打分；返回 false 表示分值不合法（界面应阻止提交）
  const rateUsage = (id, score) => {
    const item = state.usages.find((entry) => entry.id === id)
    if (!item) return false
    const value = normalizeScore(score)
    if (value === null && score !== null && score !== '') return false
    item.score = value
    item.ratedAt = new Date().toISOString()
    persist()
    return true
  }
  const remove = (collection, id) => { state[collection] = state[collection].filter((entry) => entry.id !== id); persist() }
  const reset = () => { Object.assign(state, structuredClone(seed)); persist() }
  const metrics = computed(() => config.metrics.map((metric) => ({ ...metric, value: metric.value ? metric.value(state) : state[metric.collection]?.length || 0 })))
  return { state, add, update, rateUsage, remove, reset, persist, metrics }
}
