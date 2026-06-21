/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
*/

import { createHash } from 'crypto';

const mentionRegex = /(?:@([^\s]+))\s*(.*)/i;

const handler = async function(m, { conn, text, usedPrefix, command }) {
  try {
    let mentionedJid;
    let name;
    const groupId = m.chat;

    // تحديد العضو واللقب
    if (m.quoted && m.quoted.sender) {
      mentionedJid = m.quoted.sender;
      name = text ? text.trim() : null;
    } else if (text && mentionRegex.test(text)) {
      const match = text.match(mentionRegex);
      mentionedJid = match[1] + '@s.whatsapp.net';
      name = match[2].trim();
    } else {
      throw `⚡ *الـصـيـغـة الـصـحـيـحـة:*\n> \`${usedPrefix + command} @الـعـضـو الـلـقـب\``;
    }

    if (!mentionedJid) throw `❌⃝❄ *يـرجـى تـحـديـد الـعـضـو*`;
    if (!name) throw `⚡ *يـرجـى إدخـال الـلـقـب*`;

    // جلب بيانات المستخدم
    let user = global.db.data.users[mentionedJid] || {};
    if (!user.groups) user.groups = {};

    // التحقق من التسجيل السابق
    if (user.groups[groupId] && user.groups[groupId].name) {
      throw `❌⃝❄ *هـذا الـعـضـو مـسـجـل مـسـبـقـاً*`;
    }

    // التحقق من تكرار اللقب
    for (let key in global.db.data.users) {
      const u = global.db.data.users[key];
      if (u.groups && u.groups[groupId] && u.groups[groupId].name &&
          u.groups[groupId].name.toLowerCase() === name.toLowerCase()) {
        throw `⚠️⃝⚡ *هـذا الـلـقـب مـسـتـخـدم مـن قـبـل*`;
      }
    }

    // التسجيل
    user.groups[groupId] = { name, regTime: Date.now(), registered: true };
    global.db.data.users[mentionedJid] = user;

    // النتيجة النهائية تظهر هنا فقط الحقوق
    let successMsg = ` ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                     `✅ *تـم الـتـسـجـيـل بـنـجـاح* 🏷️\n\n` +
                     `⚡ *الـلـقـب:* ${name}\n` +
                     `⏰⃝⚡ *الـوقـت:* ${new Date().toLocaleTimeString()}\n\n` +
                     `© ʙʏ ʀɪʏᴀᴅ`.trim();

    await conn.reply(m.chat, successMsg, m);
    
  } catch (err) {
    await conn.reply(m.chat, `${err}`, m);
  }
};

// إعدادات الهاندلر
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.command = /^(تلقيب|register)$/i;

export default handler;
