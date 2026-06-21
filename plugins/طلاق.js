// plugins/fun/divorce.js

const handler = async (m, { conn, text }) => {
  try {

    if (!global.db) global.db = { data: { marriages: {} }, write: async () => {} }

    const marriages = global.db.data.marriages || {}

    let targetJid = null

    if (m.mentionedJid?.length) {
      targetJid = m.mentionedJid[0]
    } else if (text?.trim()) {
      let candidate = text.trim().split(/\s+/)[0]
      candidate = candidate.replace(/^\+/, "").replace(/\D/g, "")
      if (candidate.length >= 8) targetJid = candidate + "@s.whatsapp.net"
    }

    const searchKey = Object.keys(marriages).find(k => {
      const entry = marriages[k]
      return entry &&
        (entry.groom === (targetJid || m.sender) ||
         entry.bride === (targetJid || m.sender))
    })

    if (!searchKey) {
      await m.react("⚡")
      return m.reply("⚡ *لـم أجـد سـجـل زواج مـرتـبـط بـالـطـرف الـمـطـلـوب.*")
    }

    const entry = marriages[searchKey]

    const isOwner = global.owner?.includes(m.sender) || m.sender === conn.user?.jid

    if (!(m.sender === entry.groom || m.sender === entry.bride || isOwner)) {
      await m.react("❌⃝❄")
      return m.reply("❌⃝❄ *لـيـس لـديـك تـصـريح لـطـلاق هـذا الـزواج.*")
    }

    delete marriages[searchKey]

    if (typeof global.db.write === "function") await global.db.write()

    await m.react("✅")

    const groomTag = "@" + entry.groom.split("@")[0]
    const brideTag = "@" + entry.bride.split("@")[0]

    const doneText = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

💔⃝⚡ *تـم تـسـجـيـل الـطـلاق بـالـفـعـل*
👤⃝⚡ *بـيـن:* ${groomTag} و ${brideTag}
✅ *تـم حـذف الـسـجـلات بـنـجـاح*

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    await conn.sendMessage(
      m.chat,
      { text: doneText, mentions: [entry.groom, entry.bride] },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    await m.react("❌⃝❄")
  }
}

handler.command = /^(طلاق|divorce)$/i
handler.group = true

export default handler