/*
تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁
*/

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // ⏳⃝⚡ بدء المعالجة
        await m.react('⏳⃝⚡')

        // تحديد الحالة بناءً على الأمر
        let isClose = { 
            'جروب_فتح': 'not_announcement', 
            'جروب_قفل': 'announcement' 
        }[command]

        if (isClose === undefined) return // حماية إضافية

        // تنفيذ التغيير في إعدادات المجموعة
        await conn.groupSettingUpdate(m.chat, isClose)

        // إعداد نص الرد المنسق
        let responseText = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

 ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙

✅ *تـم تـحـديـث الـإعـدادات:*

> ${isClose === 'announcement' ? '🔐⃝⚡ *تـم قـفـل الـمـجـمـوعـة*' : '🔓⃝⚡ *تـم فـتـح الـمـجـمـوعـة*'}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`

        // إرسال الرد
        await conn.reply(m.chat, responseText, m)
        
        // ✅ تأكيد الانتهاء
        await m.react('✅')

    } catch (e) {
        // ❌⃝❄ معالجة الأخطاء
        await m.react('❌⃝❄')
        console.error(e)
    }
}

handler.help = ['جروب_فتح ⃝⚡', 'جروب_قفل ⃝⚡']
handler.tags = ['group ⃝🌙']
handler.command = /^(جروب_فتح|جروب_قفل)$/i

handler.admin = true      // 🛠️⃝⚡ مشرف فقط
handler.botAdmin = true   // 🤖⃝⚡ البوت يجب أن يكون مشرفاً

export default handler
