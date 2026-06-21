import moment from 'moment-timezone';
import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

let usageLimits = {};

let handler = async (m, { isOwner, isAdmin, conn, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let groupId = m.chat;
  let usageKey = `${groupId}:${command}`;

  // 📌 تعيين الحد من المطور فقط
  if (command === 'تحديد_منشن') {
    if (!isOwner) {
      return await m.reply(`*╭━ ⚠️ تـنـبـيـه ━━⃝⚡*\n*│* ❌⃝❄ *هـذا الأمـر مـتـاح لـلـمـطـور فـقـط*\n*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`);
    }

    let limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) {
      return await m.reply(`*╭━ ⚠️ خـطأ ━━⃝⚡*\n*│* ⚡ *رجـاء إدخـال رقـم صـحـيـح لـلـحـد*\n*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`);
    }

    usageLimits[groupId] = limit;
    return await m.reply(`*╭━ ✅ تـم الـتـعـيـين ━━⃝⚡*\n*│* ✨⃝⚡ *تـم تـحـديـد حـد الـمـنـشـن إلـى ${limit} مـرة*\n*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`);
  }

  // 📊 التحقق من الحد الحالي
  if (!usageLimits[groupId]) usageLimits[groupId] = 100;
  if (usageLimits[usageKey] === undefined) usageLimits[usageKey] = usageLimits[groupId];

  if (usageLimits[usageKey] <= 0) {
    return await m.reply(`*╭━ 🚫 انـتـهى الـحـد ━━⃝⚡*\n*│* ⏳⃝⚡ *لـقـد اسـتـنـفـذت حـد الاسـتـخـدام*\n*│* ⚡ *تـواصـل مـع الـمـطـور لـلـتـجـديـد*\n*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`);
  }

  // 👥 فلترة المشاركين حسب نوع المنشن
  let filteredParticipants =
    command === 'منشن_اعضاء'  
      ? participants.filter(p => !p.admin)
      : command === 'منشن_مشرفين'  
      ? participants.filter(p => p.admin)
      : participants;

  // 📊 أرقام مزخرفة للهوية الجديدة
  const fancyNumbers = {
     0: '⓪', 1: '①', 2: '②', 3: '③', 4: '④',
     5: '⑤', 6: '⑥', 7: '⑦', 8: '⑧', 9: '⑨' 
  };
  
  const formatNumber = (num) => {
    return num.toString().split('').map(digit => fancyNumbers[digit] || digit).join('');
  };

  const participantsCount = filteredParticipants.length;

  // ⏰ الوقت والتاريخ
  let time = moment.tz('Asia/Riyadh').format('hh:mm A');
  let date = moment.tz('Asia/Riyadh').format('YYYY/MM/DD');

  // 💬 تجهيز النص المنسق
  let teks = `* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*\n\n`;
  teks += `*╭━ اختر المنشن ━⃝⚡*\n`;
  teks += `*│* ⚡ *الـنـوع:* ${command === 'منشن_اعضاء' ? 'الأعـضـاء 👥' : command === 'منشن_مشرفين' ? 'الـمـشـرفـيـن 👑' : 'الـجـمـيـع 🌍'}\n`;
  teks += `*│* 👥⃝⚡ *الـعـدد:* ${formatNumber(participantsCount)}\n`;
  teks += `*│* ⏰⃝⚡ *الـوقـت:* ${time}\n`;
  teks += `*│* 📅⃝⚡ *الـتـاريـخ:* ${date}\n`;
  teks += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n\n`;

  teks += `*╭━━ 👥 الـمـشـاركـيـن ━━⃝⚡*\n`;

  filteredParticipants.forEach((mem, i) => {
    const fancyIndex = formatNumber(i + 1);
    teks += `*│* 『 ${fancyIndex} 』 @${mem.id.split('@')[0]}\n`;
  });

  teks += `*⌬──══─┈•⤣🌓⤤•┈─══──⌬*\n\n`;
  teks += `* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 *`;

  // 🖼️ الصورة
  const imageUrl = 'https://files.catbox.moe/azc9kk.jpg';
  
  await m.react('⏳');

  await conn.sendMessage(
    m.chat,
    {
      image: { url: imageUrl },
      caption: teks,
      mentions: filteredParticipants.map(a => a.id)
    },
    { quoted: m }
  );

  usageLimits[usageKey] -= 1;
  await m.react('✅');
};

handler.help = ['منشن_الكل ⃝⚡'];
handler.tags = ['group ⃝🌙'];
handler.command = /^(منشن_اعضاء|منشن_مشرفين|منشن_الكل|تحديد_منشن)$/i;
handler.admin = true;
handler.group = true;

export default handler;
