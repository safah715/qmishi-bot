/* ⚡ 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⚡ - أمر إلغاء التسجيل */

let handler = async function (m, { conn, text, usedPrefix, command }) {
    try {
        let user = global.db.data.users[m.sender]

        if (!user.registered) {
            return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ أنت غير مسجل في البوت بالفعل*
*⃝🌙┆📌 استخدم الأمر: ${usedPrefix}تسجيل*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
        }

        if (!text) {
            return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🔐 يرجى إدخال الـ PIN لإلغاء التسجيل*
*⃝🌙┆📝 مثال: ${usedPrefix + command} 123456*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
        }

        if (text.trim() != user.pin) {
            return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ الـ PIN الذي أدخلته غير صحيح*
*⃝🌙┆⚠️ تأكد من الرقم وحاول مرة أخرى*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
        }

        // تصفير بيانات المستخدم
        user.registered = false
        user.name = ''
        user.age = 0
        user.regTime = 0
        user.pin = 0
        user.commandLimit = 0

        m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆✅ تم إلغاء تسجيلك بنجاح*
*⃝🌙┆📌 يمكنك التسجيل مجدداً في أي وقت*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`)

    } catch (e) {
        console.error(e)
        m.reply(`*⃝⚡┆❌ حدث خطأ غير متوقع أثناء إلغاء التسجيل*`)
    }
}

handler.help = ['الغاء_التسجيل']
handler.tags = ['xp']
handler.command = /^(الغاء_التسجيل|unreg)$/i

export default handler
