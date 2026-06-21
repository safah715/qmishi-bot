const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  // التحقق من الوقت المتبقي (24 ساعة)
  const nextTime = user.lastcofre + 86400000;
  if (Date.now() < nextTime) {
    await m.react('⏳⃝⚡');
    throw `❌⃝❄ *لـقـد حـصـلـت عـلـى الـكـنـز بـالـفـعـل*\n\n⚡ *عـد بـعـد:* ${msToTime(nextTime - Date.now())}`;
  }

  // رابط الصورة
  const imgUrl = 'https://files.catbox.moe/0zoqkk.jpg';

  // الجوائز العشوائية
  const gold = Math.floor(Math.random() * 10000);
  const diamond = Math.floor(Math.random() * 2000);
  const tickets = Math.floor(Math.random() * 10);
  const dollar = Math.floor(Math.random() * 100000);

  // تحديث بيانات المستخدم
  user.joincount += gold;
  user.diamond += diamond;
  user.tickets = (user.tickets || 0) + tickets;
  user.dollar = (user.dollar || 0) + dollar;
  user.lastcofre = Date.now();

  const texto = `* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*\n\n` +
                `*╭━━━ 🎁 كـنـز الـيـوم ━━⃝⚡*\n` +
                `*│* 💎⃝⚡ *جـواهـر:* ${diamond}\n` +
                `*│* 🪙⃝⚡ *ذهـب:* ${gold}\n` +
                `*│* 💵⃝⚡ *دولار:* ${dollar}\n` +
                `*│* 🎫⃝🌙 *تـذاكـر:* ${tickets}\n` +
                `*╰━━━━━━━━━━━━━⃝🌙*\n\n` +
                `*✅ تـم إضـافـة الـجـوائز لـحـسـابـك*`;

  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Nino' },
    message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
    participant: '0@s.whatsapp.net',
  };

  await m.react('🎁⃝⚡');

  // إرسال الكنز
  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: texto,
    quoted: fkontak
  });
};

handler.help = ['الكنز ⃝⚡'];
handler.tags = ['xp ⃝🌙'];
handler.command = /^(الكنز|كنز|cofreabrir)$/i;
handler.level = 0;

export default handler;

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  return `${hours} سـاعـة و ${minutes} دقـيـقـة`;
}
