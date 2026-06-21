// تــم الــتـــطـــويـــر بـــواســـطـــه ʀɪʏᴀᴅ 🍁

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const handler = async (m, { conn }) => {
  const pluginDir = './plugins';
  
  if (!fs.existsSync(pluginDir)) {
    return m.reply('˚₊‧꒰ مــاش ♡ ໒꒱ ‧₊˚\n❌ عذراً، مجلد الإضافات غير موجود.');
  }

  const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  if (files.length === 0) {
    return m.reply('˚₊‧꒰ مــاش ♡ ໒꒱ ‧₊˚\n🧞 المختبر فارغ، لا توجد ملفات لفحصها.');
  }

  await m.react('🧪');
  console.log(chalk.bold.magenta(`\n『 مختبر نينو 』 جاري بدء الفحص الشامل لـ ${files.length} ملف...`));

  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for (const file of files) {
    const fullPath = path.join(process.cwd(), pluginDir, file);
    try {
      await import(`file://${fullPath}?update=${Date.now()}`);
      
      console.log(chalk.green(`✔ [نجاح] ${file}`));
      results.push(`✅ ${file.padEnd(20)}`);
      successCount++;
    } catch (e) {
      console.log(chalk.red(`❌ [خطأ] ${file}: ${e.message}`));
      results.push(`❌⃝❄ ${file.padEnd(20)}`);
      errorCount++;
    }
  }

  // التقرير النهائي بالزخرفة المطلوبة بالظبط
  const report = `
˚₊‧꒰ مــاش ♡ ໒꒱ ‧₊˚
⌬──══─┈•⤣🌙⤤•┈─══──⌬
    ᯓ⍣⃝🌙 *تـقـريـر مـخـتـبر مــاش* ࣪𓂃
⌬──══─┈•⤣🌙⤤•┈─══──⌬

📊⃝⚡ *إحـصـائـيـات الـفـحـص:*
┌───────────────┈
│✅ الـنـاجـحـة : ${successCount}
│❌ الـفـاشـلـة : ${errorCount}
│📁 الـمـجـمـوع : ${files.length}
└───────────────┈

⌬──══─┈•⤣🌙⤤•┈─══──⌬
   📜⃝🫐 *تـفـاصـيـل الـمـلـفات*
⌬──══─┈•⤣🌙⤤•┈─══──⌬
\`\`\`
${results.join('\n')}
\`\`\`

⌬──══─┈•⤣🌙⤤•┈─══──⌬
✍️⃝🫐 *الـمـطـور:* ʀɪʏᴀᴅ 🍁
⌬──══─┈•⤣🌙⤤•┈─══──⌬`.trim();

  await conn.sendMessage(m.chat, {
    text: report,
    contextInfo: {
      externalAdReply: {
        title: "🛡️ فـاحـص الـبـلوجـنـات الـذكي",
        body: "نـــيــنــو بــتــحــبــك 🫐",
        thumbnailUrl: "https://files.catbox.moe/uwni7n.jpg",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  await m.react(errorCount === 0 ? '✔️' : '⚙️');
};

handler.help = ['فحص'];
handler.tags = ['owner'];
handler.command = /^(فحص|فحص_الكل)$/i;
handler.owner = true;

export default handler;