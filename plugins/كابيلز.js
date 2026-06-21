import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  try {
    // 🔹 التفاعل مع الرسالة لبدء التحميل
    await m.react("⏱️")

    // 🔹 جلب قاعدة بيانات الصور من GitHub
    let res = await fetch("https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json")
    let data = await res.json()

    if (!Array.isArray(data) || data.length === 0) {
      await m.react("❌⃝❄")
      return conn.reply(m.chat, "⚠️⃝⚡ لـم يـتـم الـعـثـور عـلـى بـيـانـات كـابـلـز.", m)
    }

    // 🔹 اختيار زوج عشوائي من الصور (ولد + بنت)
    let cita = data[Math.floor(Math.random() * data.length)]

    // 🔹 إرسال صورة الولد
    await conn.sendMessage(m.chat, {
      image: { url: cita.cowo },
      caption: `👦🏻⃝⚡ *صـورة الـولـد*\n\n ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n© ʙʏ ʀɪʏᴀᴅ`
    }, { quoted: m })

    // 🔹 إرسال صورة البنت
    await conn.sendMessage(m.chat, {
      image: { url: cita.cewe },
      caption: `👧🏻⃝🌙 *صـورة الـبـنـت*\n\n ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n© ʙʏ ʀɪʏᴀᴅ`
    }, { quoted: m })

    // 🔹 تفاعل النجاح
    await m.react("✅")

  } catch (err) {
    console.error(err)
    await m.react("❌⃝❄")
    conn.reply(m.chat, "❌⃝❄ حـدث خـطأ أثـنـاء تـحـمـيـل الـصـور، حـاول لاحقـاً.", m)
  }
}

handler.help = ["couplepp ⃝⚡", "كابيلز ⃝🌙"]
handler.tags = ["img ⃝🌙"]
handler.command = /^(couplepp|كابيلز|تطقيم)$/i

export default handler