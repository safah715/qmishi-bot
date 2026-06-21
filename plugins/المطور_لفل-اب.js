/* ⚡ 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⚡ - قوة المطور المطلقة */

let handler = async (m, { conn }) => {

    let user = global.db.data.users[m.sender];
    if (!user) return;

    // التحقق من هوية المطور الأساسي
    let botDevelopers = ['967783916451', '967770715532'];
    let isDev = botDevelopers.includes(m.sender.split('@')[0]);
    
    if (!isDev) {
        return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆الـحـالـة 🚫 : مـرفـوض*
*⃝🌙┆الـرسـالـة 📩 : هـذا الأمـر لـ ʀɪʏᴀᴅ فـقـط 👑*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
        );
    }

    // منح قيم المطور الخارقة لنظام نينو بوت
    user.money = 999999999999;
    user.exp = 999999999;
    user.level = 9999;
    user.limit = Infinity;
    user.premium = true;
    user.role = '👑 الـمـطـوّر الأعـلـى';

    await m.react('⚡');

    // رسالة التأكيد بالهوية المتموجة
    m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆الـحـالـة ✅ : تـم الـتـفـعـيـل*
*⃝🌙┆الـنـقـود 💰 : لـا مـحـدود*
*⃝⚡┆الـخـبـرة 🧪 : أقـصى حـد*
*⃝🌙┆الـمـسـتـوى 📈 : ${user.level}*
*⃝⚡┆الـرتـبـة ⭐ : ${user.role}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`
    );
};

handler.command = ['قويني', 'لفل_اب', 'powerup'];
handler.owner = true;

export default handler;
