/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    await m.react('⚡');
    return m.reply(
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة الـفـحـص:*
> قـم بـوضـع الـرابـط بـعـد الـأمـر
> مـثـال: ${usedPrefix + command} https://google.com

⌬──══─┈•⤣⚡⤤•┈─══──⌬`);
  }

  if (!/^https?:\/\//i.test(text)) {
    throw `⚠️⃝⚡ *عـذراً، يـجـب أن يـبـدأ الـرابـط بــ http:// أو https://*`;
  }

  await m.react('⏳⃝⚡');
  const analyzingMsg = await m.reply(`🛡️⃝⚡ *جـاري تـحـلـيـل الـرابـط وفـحـص الـبـرويـتـوكـولـات...*`);

  try {
    const suspiciousWords = [
      "login", "verify", "account", "bank", "secure", "update", 
      "free", "gift", "bonus", "earn", "crypto", "bitcoin", "pubg"
    ];

    const shorteners = [
      "bit.ly", "tinyurl", "cutt.ly", "t.co", "goo.gl", "shorturl", "is.gd"
    ];

    let isSuspicious = false;
    let reason = "";

    // 1. فـحـص الـكـلـمـات الـمـفـتـاحـيـة
    for (let word of suspiciousWords) {
      if (text.toLowerCase().includes(word)) {
        isSuspicious = true;
        reason = "يـحـتـوي عـلـى كـلـمـات تـصـيـد (Phishing)";
        break;
      }
    }

    // 2. فـحـص الـروابـط الـمـخـتـصـرة
    if (!isSuspicious) {
      for (let short of shorteners) {
        if (text.includes(short)) {
          isSuspicious = true;
          reason = "رابـط مـخـتـصـر (قـد يـخـفـي بـرمـجـيـات ضـارة)";
          break;
        }
      }
    }

    // 3. فـحـص عـنـاويـن الـ IP الـمـبـاشـرة
    if (!isSuspicious && /https?:\/\/\d+\.\d+\.\d+\.\d+/.test(text)) {
      isSuspicious = true;
      reason = "يـسـتـخـدم IP مـبـاشـر (سـلـوك مـشـبـوه)";
    }

    // 4. فـحـص اسـتـجـابـة الـخـادم
    let statusCheck;
    try {
      let res = await axios.get(text, { timeout: 4000 });
      statusCheck = `${res.status} OK`;
    } catch (e) {
      statusCheck = "غـيـر مـسـتـجـيـب أو مـحـظـور";
    }

    const resultEmoji = isSuspicious ? "⚠️⃝⚡" : "✅";
    const resultTitle = isSuspicious ? "*تـنـبـيـه: الـرابـط مـشـبـوه!*" : "*الـنـتـيـجـة: الـرابـط آمـن غالباً*";

    const finalMsg = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

${resultEmoji} ${resultTitle}

🌐 *الـرابـط:* ${text}
🔎 *حـالـة الـمـوقـع:* ${statusCheck}
🛡️ *الـتـقـيـيـم:* ${isSuspicious ? reason : "لـم يـتـم اكـتـشـاف تـهـديـدات مـبـاشـرة"}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

    await m.react(isSuspicious ? '⚠️' : '✅');
    await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: m });

  } catch (err) {
    await m.react('❌⃝❄');
    m.reply("⚠️⃝⚡ *حـدث خـطـأ أثـنـاء مـحـاولـة الـاتـصـال بـالـرابـط.*");
  }
};

handler.help = ['حلل ⃝⚡'];
handler.tags = ['tools ⃝🌙'];
handler.command = /^(حلل|فحص_رابط)$/i;

export default handler;
