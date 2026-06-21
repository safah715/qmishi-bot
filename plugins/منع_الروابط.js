// ━━━╄━✾ 「💠」 ✾━╃━━━
//      *نــظــام مـنـع الـروابـط*
// ━━━╄━✾ 「💠」 ✾━╃━━━

let handler = async (m, { conn, text }) => {

  if (!m.isGroup) return m.reply("❌ يعمل داخل المجموعات فقط")

  if (!text) return m.reply("اكتب:\nمنع_الروابط تفعيل\nاو\nمنع_الروابط تعطيل")

  if (!global.db.data.chats[m.chat])
    global.db.data.chats[m.chat] = { 
      antiLink: false,
      warnings: {}
    }

  let chat = global.db.data.chats[m.chat]

  if (text === "تفعيل") {
    chat.antiLink = true
    return m.reply(`
━━━╄━✾ 「💠」 ✾━╃━━━
   *تــم تــفــعــيــل*
   *نــظــام مـنـع الـروابـط 🔗*
━━━╄━✾ 「💠」 ✾━╃━━━`)
  }

  if (text === "تعطيل") {
    chat.antiLink = false
    return m.reply(`
━━━╄━✾ 「💠」 ✾━╃━━━
   *تــم تــعــطــيــل*
   *نــظــام مـنـع الـروابـط ❌*
━━━╄━✾ 「💠」 ✾━╃━━━`)
  }

  m.reply("استخدم: تفعيل او تعطيل")
}

handler.command = /^منع_الروابط$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler


// ━━━╄━✾ 「💠」 ✾━╃━━━
//   *3 تـحـذيـرات ثـم طـرد*
// ━━━╄━✾ 「💠」 ✾━╃━━━

handler.before = async function (m, { conn }) {

  if (!m.isGroup) return
  if (!m.text) return

  let chat = global.db.data.chats[m.chat]
  if (!chat?.antiLink) return

  const metadata = await conn.groupMetadata(m.chat)
  const botAdmin = metadata.participants.find(p => p.id === conn.user.jid)?.admin
  if (!botAdmin) return

  const senderData = metadata.participants.find(p => p.id === m.sender)
  if (senderData?.admin) return

  const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me)/i

  if (linkRegex.test(m.text)) {

    if (!chat.warnings[m.sender])
      chat.warnings[m.sender] = 0

    chat.warnings[m.sender]++

    // حذف الرسالة
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    })

    // لو وصل 3 تحذيرات → طرد
    if (chat.warnings[m.sender] >= 3) {

      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
      delete chat.warnings[m.sender]

      return conn.sendMessage(m.chat, {
        text: `
━━━╄━✾ 「💠」 ✾━╃━━━
   *🚫 تــم طــرد الـعــضــو*
   *بـسـبـب تـكـرار إرسـال الروابـط*
━━━╄━✾ 「💠」 ✾━╃━━━`
      })
    }

    // تحذير عادي
    await conn.sendMessage(m.chat, {
      text: `
━━━╄━✾ 「💠」 ✾━╃━━━
   *⚠️ تــحــذيــر ${chat.warnings[m.sender]}/3*
   *يُمنع إرسال الروابط*
━━━╄━✾ 「💠」 ✾━╃━━━`,
      mentions: [m.sender]
    })
  }
}