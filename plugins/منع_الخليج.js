// ===============================
// أمر التفعيل / التعطيل + نظام الطرد
// ===============================

let handler = async (m, { conn, text }) => {

  if (!m.isGroup) return m.reply("*❌ هذا الأمر يعمل فقط في المجموعات*")

  // جلب بيانات القروب
  const groupMetadata = await conn.groupMetadata(m.chat)
  const senderId = m.sender
  const participant = groupMetadata.participants.find(p => p.id === senderId)

  // السماح فقط للأدمن أو صاحب القروب باستخدام الأمر
  if (!participant?.admin && senderId !== groupMetadata.owner) {
    return m.reply("*❌ فقط الأدمن أو صاحب القروب يمكنه استخدام هذا الأمر*")
  }

  // التأكد من كتابة التفعيل أو التعطيل
  if (!text) return m.reply("اكتب:\n*منع_الخليج تفعيل*\nاو\n*منع_الخليج تعطيل*")

  // إنشاء الإعدادات لو غير موجودة
  if (!global.db.data.settings) global.db.data.settings = {}
  if (!global.db.data.settings[conn.user.jid]) {
    global.db.data.settings[conn.user.jid] = { blockNonEgypt: false }
  }

  let setting = global.db.data.settings[conn.user.jid]

  if (text === "تفعيل") {
    setting.blockNonEgypt = true
    return m.reply("*✅ تم تفعيل منع جميع الأرقام غير المصرية 🇪🇬*")
  } 
  else if (text === "تعطيل") {
    setting.blockNonEgypt = false
    return m.reply("❌ تم تعطيل النظام")
  } 
  else {
    return m.reply("استخدم: تفعيل او تعطيل")
  }
}

// ===============================
// نظام الطرد التلقائي عند انضمام أي عضو
// ===============================

handler.before = async function (m, { conn, participants }) {

  if (!m.isGroup) return

  let setting = global.db.data.settings?.[conn.user.jid]
  if (!setting?.blockNonEgypt) return

  // التأكد أن البوت أدمن
  const groupMetadata = await conn.groupMetadata(m.chat)
  const botNumber = conn.user.jid
  const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin
  if (!botAdmin) return

  // صاحب القروب
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + "@s.whatsapp.net"

  for (let user of participants) {

    let number = user.id.split("@")[0]

    // السماح لمصر فقط
    if (number.startsWith("20")) continue

    // لا تطرد صاحب القروب
    if (user.id === groupOwner) continue

    // طرد أي عضو غير مصري
    await conn.groupParticipantsUpdate(m.chat, [user.id], "remove")
  }
}

handler.command = /^منع_الخليج$/i
handler.group = true
handler.botAdmin = true
handler.admin = true // يحدد أن الأمر للأدمن
export default handler