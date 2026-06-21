/* ⚡ 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⚡ - أمر خروج البوت المؤقت */

const handler = async (m, { conn, usedPrefix, command, args }) => {
  let usageMsg = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆📍 الاستخدام الصحيح للأمر:*
*⃝🌙┆${usedPrefix + command} 1ي (خروج بعد يوم)*
*⃝⚡┆${usedPrefix + command} 2س (خروج بعد ساعتين)*
*⃝🌙┆${usedPrefix + command} 1د (خروج بعد دقيقة)*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`;

  if (!m.isGroup) return m.reply('*⃝⚡┆⚠️ هذا الأمر يعمل داخل المجموعات فقط*');

  // أرقام المطورين المحدثة
  let botDevelopers = ['967783916451@s.whatsapp.net', '967783916451@s.whatsapp.net'];

  if (!botDevelopers.includes(m.sender)) {
    return m.reply('*⃝⚡┆❌ عـذراً، هـذا الأمـر مـخصـص لـمـطوري الـنظـام فـقط !!*');
  }

  if (!args[0]) return m.reply(usageMsg);

  let timeStr = args[0];
  let unit = timeStr.slice(-1);
  let amount = parseInt(timeStr.slice(0, -1));

  if (isNaN(amount)) return m.reply('*⃝⚡┆❌ يـرجى إدخـال رقـم صـحيح لـتحديـد الـوقت !!*');

  let timeMultiplier = { 'ي': 24 * 60 * 60 * 1000, 'س': 60 * 60 * 1000, 'د': 60 * 1000 }[unit];

  if (!timeMultiplier) {
    return m.reply('*⃝⚡┆❌ يـرجى استـخدام (ي = يوم) أو (س = ساعة) أو (د = دقيقة) !!*');
  }

  let delay = amount * timeMultiplier;
  let unitName = { 'ي': 'يوم', 'س': 'ساعة', 'د': 'دقيقة' }[unit];

  m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆✅ تـم تـحـديـد مـدة الـخـروج*
*⃝🌙┆⏳ سـيغادر الـبوت الـمجموعة بـعد: 『 ${amount} 』 ${unitName}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`);

  setTimeout(async () => {
    try {
      let groupMetadata = await conn.groupMetadata(m.chat);
      let participants = groupMetadata.participants.map(p => p.id);
      
      await conn.sendMessage(m.chat, {
        text: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🔔 تـنـبيـه انـتـهـاء الـمـدة*
*⃝🌙┆لقـد انـتهى وقـت تـواجد الـبوت بـينكـم*
*⃝⚡┆لـلـتـجديـد تـواصـل مـع الـمـطـور ʀɪʏᴀᴅ*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ​𝑄𝑀𝐼𝑆𝐻𝐼`,
        mentions: participants
      });

      await conn.groupLeave(m.chat);
    } catch (e) {
      console.error(e);
      m.reply('*⃝⚡┆❌ حـدث خـطأ أثـناء مـحاولة الـمـغادرة*');
    }
  }, delay);
};

handler.help = ['خروج_مؤقت'];
handler.tags = ['owner'];
handler.command = ['الخروج', 'exitdelay'];
handler.group = true;
handler.owner = true;

export default handler;
