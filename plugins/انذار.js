/* ⚡ 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⚡ - نظام التحذير والعقاب */

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return

  let who
  if (m.isGroup) {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
  } else {
    who = m.chat
  }

  if (!who) {
    return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆⚠️ يـرجـى الـرد عـلى رسـالة أو مـنـشـن الـعـضـو*
*⃝🌙┆مـثـال: ${usedPrefix + command} @user*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
    )
  }

  let user = global.db.data.users[who]
  if (!user) {
    global.db.data.users[who] = { warn: 0 }
    user = global.db.data.users[who]
  }

  // ================== أمر التحذير (انذار) ==================
  if (/^(تحذير|انذار|warn)$/i.test(command)) {
    const reason = text ? text.replace(/@\d+-?\d*/g, '') : 'بـدون سـبـب واضـح'
    user.warn = (user.warn || 0) + 1

    await conn.sendMessage(m.chat, {
      text:
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🔔 إنــــــــذار جـــــديـــــد*
*⃝🌙┆الـعـضـو: @${who.split('@')[0]}*
*⃝⚡┆الـسـبـب: ${reason}*
*⃝🌙┆الـعـدد: ${user.warn}/3*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`,
      mentions: [who]
    }, { quoted: m })

    if (user.warn >= 3) {
      user.warn = 0
      await conn.sendMessage(m.chat, {
        text:
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🚫 إنـــــذار نــــهــــائــــي*
*⃝🌙┆الـعـضـو: @${who.split('@')[0]}*
*⃝⚡┆الإجـراء: طـرد مـن الـمـجـمـوعـة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`,
        mentions: [who]
      }, { quoted: m })
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
  }

  // ================== أمر إلغاء الإنذار ==================
  if (/^(الغاء_انذار)$/i.test(command)) {
    if (!user.warn || user.warn === 0) {
      return m.reply('*⃝⚡┆⚠️ هـذا الـعـضـو سـجـلـه نـظـيـف مـن الإنـذارات*')
    }

    user.warn -= 1
    await conn.sendMessage(m.chat, {
      text:
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆✅ تـم إعـفـاء الـعـضـو*
*⃝🌙┆الـعـضـو: @${who.split('@')[0]}*
*⃝⚡┆الـمـتـبـقي: ${user.warn}/3*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`,
      mentions: [who]
    }, { quoted: m })
  }
  return false
}

handler.help = ['انذار', 'الغاء_انذار']
handler.tags = ['admin']
handler.command = /^(تحذير|انذار|warn|الغاء_انذار)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
