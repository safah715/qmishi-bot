export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    // تجاهل الرسائل من البوت نفسه
    if (m.isBaileys && m.fromMe) return !0;
    
    // نعمل فقط في الخاص (عدم التعامل مع المجموعات هنا)
    if (m.isGroup) return !1;
    
    // تجاهل الرسائل الفارغة
    if (!m.message) return !0;
    
    // بيانات الدردشة والإعدادات
    const chat = global.db.data.chats[m.chat];
    const bot = global.db.data.settings[this.user.jid] || {};
    
    // التحقق من تفعيل الحماية في الخاص
    // إذا كان المستخدم ليس المطور (owner) ولا المطور الرئيسي (ROwner) فسيتم حظره عند أي كلمة
    if (bot.antiPrivate && !isOwner && !isROwner) {
        
        // رسالة التحذير قبل الحظر
        await conn.sendMessage(m.chat, {
            text: `*⌬──══┈•⤣🌒⤤•┈══──⌬*\n` +
                  `*◞‼️◜:•⪼ ممنوع الكلام في الخاص مع البوت!*\n` +
                  `*┊🤖┊:•⪼ سيتم حظرك الان تلقائياً*\n` +
                  `*┊📱┊:•⪼ للتواصل مع المطور:*\n` +
                  `*┊📞┊:•⪼ wa.me/967783916451*\n` +
                  `*\n` +
                  `*┊💰┊:•⪼ تريد تعمل بوت يبقى خاص بك؟*\n` +
                  `*┊💵┊:•⪼ التكلفة الكلية: 4 دولار فقط*\n` +
                  `*┊✨┊:•⪼ تواصل مع المطور الآن*\n` +
                  `*⌬──══┈•⤣🪶⤤•┈══──⌬*`,
            mentions: [m.sender]
        }, { quoted: m });
        
        // حظر المستخدم
        await conn.updateBlockStatus(m.chat, 'block');
        return !0;
    }
    
    return !1;
}