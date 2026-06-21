import fs from 'fs';
import path from 'path';

// مسموح فقط للمطور الرئيسي
const allowedNumbers = ['967783916451@s.whatsapp.net', '967783916451@s.whatsapp.net'];

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!allowedNumbers.includes(m.sender)) {
    await m.react('❌');
    return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆⚠️ عـذراً، هـذا الأمـر مـخـصـص لـمـطـور الـنـظـام فـقـط*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`);
  }

  if (!text || !text.includes('|')) {
    return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆📝 يـرجى كـتابـة الأمـر بـالـشـكـل الـتـالـي:*
*⃝🌙┆${usedPrefix + command} الـكلمة_الـقديمة|الـكلمة_الـجديدة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`);
  }

  const [oldWord, newWord] = text.split('|').map(s => s.trim());

  if (!oldWord || !newWord) {
    return m.reply('*⃝⚡┆⚠️ يـرجى الـتأكـد مـن إدخـال الـكلمتـين (قـديم|جـديد)*');
  }

  try {
    await m.react('🕒');
    const basePath = 'plugins';
    const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js'));
    let changedFiles = 0;

    for (let file of files) {
      const filePath = path.join(basePath, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes(oldWord)) {
          const newContent = content.split(oldWord).join(newWord);
          fs.writeFileSync(filePath, newContent, 'utf-8');
          changedFiles++;
        }
      } catch (err) {
        console.error(`Error in file ${file}:`, err);
      }
    }

    let message = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆✅ تـم الـتـعديـل بـنـجـاح*
*⃝🌙┆الـقـديم: [ ${oldWord} ]*
*⃝⚡┆الـجـديـد: [ ${newWord} ]*
*⃝🌙┆الـمـلـفات الـمـتأثـرة: ${changedFiles}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`;

    await m.reply(message);
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.reply('*⃝⚡┆❌ حـدث خـطأ تـقـني أثـناء الـتـبديل*');
  }
};

handler.help = ['بدل'];
handler.tags = ['owner'];
handler.command = /^بدل$/i;
handler.owner = true;

export default handler;
