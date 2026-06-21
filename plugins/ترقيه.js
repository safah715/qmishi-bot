/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

let handler = async (m, { conn, text, usedPrefix, isAdmin, isOwner, command }) => {
  if (!isAdmin && !isOwner) 
    return conn.reply(m.chat, ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n⚠️⃝⚡ *هـذا الـأمـر مـخـصـص لـلـمـشـرفـيـن فـقـط*`, m);

  let user;

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    user = m.mentionedJid[0]; // منشن
  } else if (m.quoted) {
    user = m.quoted.sender; // رد
  } else if (text) {
    let number = text.replace(/[^0-9]/g, '');
    if (number.length < 11 || number.length > 13) {
      return conn.reply(m.chat, ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n⚠️⃝⚡ *الـرقـم غـيـر صـحـيـح، الـرجـاء إدخـال رقـم صـالـح*`, m);
    }
    user = number + '@s.whatsapp.net';
  } else {
    return conn.reply(m.chat, ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n⚡ *الـرجـاء مـنـشـن الـشـخـص أولـاً*\n\n📌⃝⚡ *مـثـال:*\n> ${usedPrefix + command} @منشن`, m);
  }

  try {
    if (command.match(/^(ترقيه|رفع|ارفع)$/i)) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
      await conn.sendMessage(m.chat, {
        text: ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n✅ *تـم تـرقـيـة *@${user.split('@')[0]}* إلـى مـشـرف*`,
        mentions: [user]
      }, { quoted: m });
    } else if (command.match(/^(demote|اعفاء)$/i)) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
      await conn.sendMessage(m.chat, {
        text: ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n✅ *تـم إعـفـاء *@${user.split('@')[0]}* مـن الـإدارة*`,
        mentions: [user]
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n⚠️⃝⚡ *حـدث خـطأ أثـنـاء تـنـفـيـذ الـعـمـلـيـة*`, m);
  }
};

handler.help = ['ترقيه @منشن', 'اعفاء @منشن'];
handler.tags = ['group'];
handler.command = ['ترقيه','ارفع','demote','اعفاء']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
