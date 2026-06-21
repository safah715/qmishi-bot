import db from '../lib/database.js'

const free = 5000
const prem = 20000
const WEEK = 7 * 24 * 60 * 60 * 1000

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let time = user.lastclaim + WEEK

  // التحقق من الوقت المتبقي
  let remainingTime = time - new Date().getTime()
  if (remainingTime > 0) {
    return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🚫 لـقـد اسـتـلـمـت الـمـكـافـأة الأسبوعـية بـالـفعل*
*⃝🌙┆⏳ يـمـكـنـك الاسـتـلام بـعـد:*
*⃝⚡┆🕒 ${clockString(remainingTime)}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
    )
  }

  // إضافة المكافأة
  user.exp += isPrems ? prem : free
  m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎁 مـكـافـأة أسبوعـيـة*
*⃝🌙┆✅ تـم إضـافـة الـمـكـافـأة بـنـجـاح*
*⃝⚡┆🆙 XP: +${isPrems ? prem : free}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
  )

  // تحديث وقت آخر استلام
  user.lastclaim = new Date().getTime()
}

handler.help = ['weekly']
handler.tags = ['econ']
handler.command = ['اسبوعي']

export default handler

function clockString(ms) {
  if (isNaN(ms) || ms < 0) return '0 أيام 0 ساعات 0 دقائق'

  let days = Math.floor(ms / (1000 * 60 * 60 * 24))
  let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

  return `${days} أيام ${hours} ساعات ${minutes} دقائق`
}
