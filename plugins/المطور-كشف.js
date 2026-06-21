import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆⚠️ يـرجـى إدخـال الـكلمة لـلـبـحـث عـنـهـا*\n*⃝🌙┆📝 مـثال: ${usedPrefix + command} menu*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`);
  }

  await m.react('🔍');
  
  const basePath = 'plugins';
  const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js'));
  const matchedResults = [];
  let fileReadErrors = [];

  // أنماط النصوص المسموح بها مع تطابق دقيق
  const validPatterns = [
    /^handler\.command\s*=\s*\/\^(tr)\$\/i/,
    /^const\s+audioCommands\s*=\s*\[.*\]/,
    /handler\.help\s*=\s*\[.*\]/,
    /handler\.command\s*=\s*\/\^.*\$/i,
    /=\s*\[.*\]/,
  ];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(basePath, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const fileLines = fileContent.split('\n');

      fileLines.forEach((line, index) => {
        if (line.includes(text)) {
          if (validPatterns.some(pattern => pattern.test(line))) {
            matchedResults.push({
              fileIndex: i + 1,
              fileName,
              lineNumber: index + 1,
              lineContent: line.trim(),
            });
          }
        }
      });
    } catch (error) {
      fileReadErrors.push({ fileName, error: error.message });
    }
  }

  if (matchedResults.length > 0) {
    let responseMessage = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
    responseMessage += `*⃝⚡┆✅ تـم الـعـثـور عـلى [ ${text} ] :*\n\n`;
    
    matchedResults.forEach(({ fileIndex, fileName, lineNumber, lineContent }) => {
      responseMessage += `*⃝🌙┆الـكـود:* ${fileIndex}\n`;
      responseMessage += `*⃝⚡┆الـمـلـف:* ${fileName}\n`;
      responseMessage += `*⃝🌙┆الـسـطـر:* ${lineNumber}\n`;
      responseMessage += `*⃝⚡┆الـمـحـتوى:* \`${lineContent}\`\n`;
      responseMessage += `*┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈*\n`;
    });

    responseMessage += `\n ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`;
    await m.reply(responseMessage);
    await m.react('✅');
  } else {
    let errorMessage = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n`;
    errorMessage += `*⃝⚡┆❌ لـم يـتـم الـعـثـور عـلى [ ${text} ]*\n`;
    errorMessage += `*⃝🌙┆تـأكـد مـن الـكلمة أو نـوع الـسـطـر*\n`;
    errorMessage += `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`;

    if (fileReadErrors.length > 0) {
      errorMessage += `\n\n*⃝⚠️ تـنـبـيـه: فـشل قـراءة ${fileReadErrors.length} مـلـف*`;
    }

    await m.reply(errorMessage);
    await m.react('❌');
  }
};

handler.help = ['كشف'];
handler.tags = ['owner'];
handler.command = /^(كشف)$/i;
handler.rowner = true;

export default handler;
