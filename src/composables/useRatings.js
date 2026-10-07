// 评分的有效范围与归一化逻辑。
// 打分界面只能给出 1~5 的整数；历史数据或直接改库可能出现空值、0、越界值，
// 统一在这里清洗，避免平均分时把“未评分”误当成 0 分。
export const RATING_MIN = 1
export const RATING_MAX = 5

// 把任意来源的评分转成有效分值；不合法一律视为“未评分”（null）。
// 旧记录里的 0 分不在 1~5 范围内，按未评分处理：不计入平均、可补打分。
export function normalizeScore(value) {
  if (value === null || value === undefined || value === '') return null
  const score = Number(value)
  if (!Number.isFinite(score)) return null
  if (score < RATING_MIN || score > RATING_MAX) return null
  return Math.round(score * 10) / 10
}

// 取出一批烹饪记录中“已有效评分”的分值
export function ratedScores(usages) {
  return (usages || [])
    .map((x) => normalizeScore(x.score))
    .filter((score) => score !== null)
}

// 平均评分：分母只算已评分记录，未评分（含旧的 0 分）不拉低平均
export function averageRating(usages) {
  const scores = ratedScores(usages)
  if (!scores.length) return { avg: null, count: 0, total: (usages || []).length }
  const sum = scores.reduce((a, b) => a + b, 0)
  return { avg: Math.round((sum / scores.length) * 10) / 10, count: scores.length, total: (usages || []).length }
}
