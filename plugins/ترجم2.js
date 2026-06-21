/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

import fetch from 'node-fetch'

const handler = async (m, { conn, args }) => {
    // حالة الخطأ: نقص في البيانات (بدون حقوق)
    if (args.length < 2) {
        let helpCaption = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
              `⚠️⃝⚡ *يُـرجـى تـحـديـد الـلـغـة ثـم الـنـص*\n` +
              `📌⃝⚡ *مـثــال:* .تنفيذ_الترجمة en مرحبا`
        return conn.sendMessage(m.chat, { text: helpCaption }, { quoted: m })
    }

    const lang = args[0].toLowerCase()
    const text = args.slice(1).join(' ')
    const url = `https://api.popcat.xyz/translate?to=${lang}&text=${encodeURIComponent(text)}`

    try {
        const res = await fetch(url)
        const data = await res.json()

        // حالة الخطأ: فشل من السيرفر (بدون حقوق)
        if (!data.translated) {
            let errorCaption = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                `❌⃝⚡ *فـشـل فـي الـتـرجـمـة!*\n` +
                `🔤⃝⚡ *تـأكـد مـن إدخـال لـغـة مـدعـومـة*`
            return conn.sendMessage(m.chat, { text: errorCaption }, { quoted: m })
        }

        // حالة النجاح: النتيجة (مع الحقوق فقط هنا)
        const reply = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                      `🌍⃝⚡ *الـلـغـة:* ${lang.toUpperCase()}\n` +
                      `✅ *الـتـرجـمـة:* ${data.translated}\n\n` +
                      `© ʙʏ ʀɪʏᴀᴅ`

        await conn.sendMessage(m.chat, { text: reply }, { quoted: m })

    } catch (error) {
        // حالة الخطأ: مشكلة تقنية (بدون حقوق)
        const errMsg = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                      `⚠️⃝⚡ *حـدث خـطـأ أثـنـاء الـتـرجـمـة!*\n` +
                      `⏰⃝⚡ *الـتـفـاصـيـل:* ${error.message}`
        await conn.sendMessage(m.chat, { text: errMsg }, { quoted: m })
    }
}

handler.command = /^تنفيذ_الترجمة$/i
export default handler
