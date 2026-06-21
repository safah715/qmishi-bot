/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import { createHash } from 'crypto';

const handler = async function(m, { conn, text, usedPrefix, command }) {
  const groupId = m.chat;
  let users = global.db.data.users;

  if (!users[m.sender]) users[m.sender] = {};
  if (!users[m.sender].groups) users[m.sender].groups = {};

  const user = users[m.sender];

  try {
    // 1. حـجـز الـلـقـب ⚡
    if (command === 'حجز_لقب') {
      if (!text) throw `> ⚡ *يـرجـى كـتـابـة الـلـقـب!*\n> مـثـال: ${usedPrefix + command} الـأسـطـورة`;

      if (user.groups[groupId]?.name) {
        throw `> 🛠️⃝⚡ *لـديـك لـقـب مـحـجـوز بـالـفـعـل:* \n> 「 ${user.groups[groupId].name} 」`;
      }

      for (let key in users) {
        if (users[key].groups?.[groupId]?.name?.toLowerCase() === text.toLowerCase()) {
          throw `> ❌ *هـذا الـلـقـب مـحـجـوز مـسـبـقـاً!*`;
        }
      }

      await m.react('⏳⃝⚡');
      user.groups[groupId] = { name: text, regTime: Date.now(), registered: true };
      
      await conn.reply(m.chat, `✅ *تـم حـجـز الـلـقـب بـنـجـاح:*\n> 🏷️ *الـلـقـب:* ${text}`, m);
      await m.react('✅');

    // 2. قـائـمـة الـألـقـاب 📋⃝⚡
    } else if (command === 'الالقاب_المحجوزه') {
      let reservedNames = [];

      for (let key in users) {
        const u = users[key];
        if (u.groups?.[groupId]?.name) {
          reservedNames.push(`> 🏷️ *${u.groups[groupId].name}* ⇽ @${key.split('@')[0]}`);
        }
      }

      if (reservedNames.length === 0) throw `> ⏳⃝⚡ *لـا تـوجـد ألـقـاب مـحـجـوزة حـتـى الـآن.*`;

      await conn.reply(m.chat, `📋⃝⚡ *قـائـمـة ألـقـاب الـمـجـمـوعـة:*\n\n${reservedNames.join('\n')}`, m, { mentions: Object.keys(users).filter(k => users[k].groups?.[groupId]?.name) });

    // 3. إلـغـاء الـحـجـز 🗑️⃝⚡
    } else if (command === 'الغاء_حجز') {
      if (!user.groups?.[groupId]?.name) throw `> 🛠️⃝⚡ *أنـت لـا تـمـلـك لـقـبـاً لـإلـغـائـه.*`;

      const oldName = user.groups[groupId].name;
      delete user.groups[groupId];

      await conn.reply(m.chat, `✅ *تـم إلـغـاء حـجـز الـلـقـب:* \n> 「 ${oldName} 」`, m);
      await m.react('✅');
    }

  } catch (err) {
    await m.react('⏰⃝⚡');
    await conn.reply(m.chat, `${err}`, m);
  }
};

handler.group = true;
handler.botAdmin = true;
handler.command = /^(حجز_لقب|الالقاب_المحجوزه|الغاء_حجز)$/i;

export default handler;
