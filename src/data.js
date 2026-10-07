export const today = new Date().toISOString().slice(0, 10)
const days = (date) => Math.ceil((new Date(`${date}T00:00:00`) - new Date(`${today}T00:00:00`)) / 86400000)

export const RATING_MIN = 1
export const RATING_MAX = 5

// 规范化用户输入的评分：
// - null/undefined/''（未评分）→ null，不计入平均
// - 非数字或超出 1~5 合理范围 → null（旧数据里的 0 同样被视为未评分）
// - 合法值取整后返回，保证只落库干净的整数星级
export function normalizeScore(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n < RATING_MIN || n > RATING_MAX) return null
  return Math.round(n)
}

// 只统计已打过分（1~5）的烹饪记录；评分为空、非数字、0（旧记录）均不计入
export function averageScore(usages) {
  const rated = usages
    .map((x) => normalizeScore(x.score))
    .filter((n) => n !== null)
  if (!rated.length) return null
  return rated.reduce((a, n) => a + n, 0) / rated.length
}

export const config = {
  storageKey: 'family-recipe-keeper-v1', brand: '家味成长', subtitle: 'Family Kitchen', entityLabel: '菜谱', secondaryLabel: '每周菜单', historyLabel: '烹饪实践', historyTitle: '我的烹饪记录', heroTitle: '把每一顿饭，做成家的记忆。', heroCopy: '收藏菜谱、安排菜单，也记录每次变得更好的过程。', createLabel: '添加菜谱', dateLabel: '最近烹饪', locationLabel: '难度 / 时间', copyLabel: '小贴士', secondaryTitle: '本周菜单与采购清单', secondaryAction: '安排菜谱', secondaryDatePrefix: '周',
  nav: [{ id: 'overview', label: '总览' }, { id: 'documents', label: '我的菜谱' }, { id: 'history', label: '烹饪记录' }, { id: 'insurance', label: '每周菜单' }, { id: 'achievements', label: '挑战与榜单' }],
  metrics: [{ label: '菜谱总数', collection: 'documents', tone: 'green' }, { label: '本月烹饪次数', tone: 'peach', value: (s) => s.usages.filter((x) => x.date?.slice(0, 7) === today.slice(0, 7)).length }, { label: '平均评分', tone: 'gold', icon: 'star', value: (s) => { const avg = averageScore(s.usages); return avg === null ? '—' : avg.toFixed(1) }, hint: (s) => { const count = s.usages.filter((x) => normalizeScore(x.score) !== null).length; return count ? `基于 ${count} 次评分` : '还没有评分' } }, { label: '采购完成率', tone: 'blue', value: (s) => `${s.policies.filter((x) => x.done).length}/${s.policies.length}` }],
  form: { title: '添加新菜谱', collection: 'documents', fields: [['name', '菜名', '番茄牛腩'], ['category', '菜系', '家常'], ['holder', '难度', '中等'], ['number', '准备 / 烹饪时间', '20 / 60 分钟'], ['issued', '最近烹饪日期', today, 'date'], ['expires', '下次推荐日期', `${new Date().getFullYear()}-12-31`, 'date'], ['location', '食材清单', '牛腩 500g、番茄 2 个'], ['copyLocation', '调料清单', '盐、生抽、八角'], ['notes', '小贴士', '小火慢炖更入味'] ] },
  cookForm: {
    title: '登记烹饪记录', collection: 'usages',
    statuses: ['完成', '翻车了', '借用中'],
    fields: [['date', '烹饪日期', today, 'date'], ['purpose', '用餐场景', '周末晚餐'], ['borrower', '经办人', '林小满'], ['note', '备注', '下次少放盐']]
  },
  categories: ['川菜', '粤菜', '湘菜', '家常', '西餐', '烘焙', '其他'], achievements: ['初次下厨', '菜谱收藏家', '烹饪达人', '零失败', '家庭大厨', '连续七天', '新菜探索者', '甜点大师', '采购有序', '味觉记录者', '分享达人', '厨房领航员']
}
export const seed = { documents: [{ id: 'recipe-1', name: '番茄牛腩', category: '家常', holder: '中等', number: '20 / 60 分钟', issued: '2026-09-12', expires: '2026-10-12', location: '牛腩 500g、番茄 2 个、洋葱', copyLocation: '盐、生抽、八角', notes: '最后加一点番茄酱' }, { id: 'recipe-2', name: '葱油拌面', category: '家常', holder: '简单', number: '10 / 15 分钟', issued: '2026-09-15', expires: '2026-11-01', location: '面条、葱', copyLocation: '生抽、糖、油', notes: '葱段要小火慢熬' }, { id: 'recipe-3', name: '抹茶巴斯克', category: '烘焙', holder: '困难', number: '30 / 45 分钟', issued: '2026-08-05', expires: '2026-09-20', location: '奶油奶酪、鸡蛋、抹茶', copyLocation: '糖、淡奶油', notes: '冷藏一夜口感最佳' }], usages: [{ id: 'cook-1', documentId: 'recipe-1', date: '2026-09-12', purpose: '周末晚餐', borrower: '林小满', status: '完成', score: 5, note: '家人说汤汁很香' }, { id: 'cook-2', documentId: 'recipe-2', date: '2026-09-15', purpose: '工作日晚餐', borrower: '周予安', status: '完成', score: 4, note: '下次多加葱' }, { id: 'cook-3', documentId: 'recipe-3', date: '2026-09-14', purpose: '周末下午茶', borrower: '林小满', status: '完成', score: 0, note: '旧版 App 录入，当时没打分' }, { id: 'cook-4', documentId: 'recipe-2', date: '2026-09-16', purpose: '快手宵夜', borrower: '周予安', status: '完成', note: '还没来得及评价' }], policies: [{ id: 'menu-1', type: '周一 · 番茄牛腩', company: '采购清单', number: '牛腩 500g / 番茄 2 个', expires: '周一', amount: 0, payment: '未采购', insured: '家庭晚餐', done: false }, { id: 'menu-2', type: '周三 · 葱油拌面', company: '采购清单', number: '面条 / 小葱', expires: '周三', amount: 0, payment: '已采购', insured: '家庭晚餐', done: true }] }
export { days }
