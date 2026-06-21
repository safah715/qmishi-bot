/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // ⏳⃝⚡ جـاري فـحـص الـبـيـانـات
    let mentionedJid = m.quoted ? m.quoted.sender : (text ? (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : null);

    if (!mentionedJid) {
      await m.react('⚡');
      throw `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n⚡ *طـريـقـة الـاسـتـخـدام:*\n> ${usedPrefix + command} @الـعـضـو\n> أو قـم بـالـرد عـلـى رسـالـتـه`;
    }

    const users = global.db?.data?.users || {};
    let user = users[mentionedJid];

    if (!user || !user.groups || !user.groups[m.chat] || !user.groups[m.chat].name) {
      throw `⚠️⃝⚡ *هـذا الـعـضـو لـا يـمـلـك لـقـبـاً مـسـجـلـاً فـي هـذه الـمـجـمـوعـة.*`;
    }

    await m.react('⏳⃝⚡');
    const oldName = user.groups[m.chat].name;

    // تـنـفـيـذ الـحـذف
    delete users[mentionedJid].groups[m.chat].name;

    const successMsg = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n✅ *تـم حـذف الـلـقـب بـنـجـاح:*\n\n👤 *الـعـضـو:* @${mentionedJid.split('@')[0]}\n🗑️ *الـلـقـب الـمـحـذوف:* ${oldName}\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

    await conn.reply(m.chat, successMsg, m, { mentions: [mentionedJid] });
    await m.react('✅');

  } catch (err) {
    await m.react('❌⃝❄');
    await conn.reply(m.chat, `${err}`, m);
  }
};

handler.help = ['حذف_لقب ⃝⚡'];
handler.tags = ['admin ⃝🌙'];
handler.command = /^(حذف-لقب|حذف_لقب)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
