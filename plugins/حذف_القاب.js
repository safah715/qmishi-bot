/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

let handler = async function (m, { conn }) {
  try {
    // ⏳⃝⚡ بدء عملية المسح الشامل
    await m.react('⏳⃝⚡')

    const groupId = m.chat;
    const groupInfo = await conn.groupMetadata(groupId);

    if (!groupInfo) throw '❌⃝❄ فشل في الوصول لبيانات المجموعة.';

    const groupMembers = groupInfo.participants;
    const users = global.db?.data?.users || {};

    // تصفية المستخدمين الذين يملكون ألقاباً في هذه المجموعة فقط
    const usersWithNicknames = Object.entries(users)
      .filter(([jid, user]) => user.groups?.[groupId]?.name)
      .map(([jid, user]) => ({ jid, name: user.groups[groupId].name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

    if (usersWithNicknames.length === 0) {
      await m.react('ℹ️⃝⚡')
      return m.reply('⚠️⃝⚡ لا توجد ألقاب مسجلة في سجلات هذه المجموعة حالياً.')
    }

    let resultMessage = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n`
    resultMessage += `🧹⃝⚡ *تـطـهـيـر الـألقـاب:* \n\n`

    for (let user of usersWithNicknames) {
      // حذف اللقب نهائياً
      delete users[user.jid].groups[groupId].name;
      resultMessage += `> ❌ *${user.name}*\n`;
    }

    resultMessage += `\n📊⃝⚡ *الـإحـصـائـيـة الـنـهـائـيـة:* \n`
    resultMessage += `> 📉 الـمـحـذوفة: ${usersWithNicknames.length}\n`
    resultMessage += `> 👥 الـأعـضـاء: ${groupMembers.length}\n\n`
    resultMessage += `⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    await conn.reply(groupId, resultMessage.trim(), m, { mentions: usersWithNicknames.map(v => v.jid) });
    await m.react('✅')

  } catch (err) {
    await m.react('❌⃝❄')
    await conn.reply(m.chat, `⚠️⃝⚡ *حـدث خـطـأ:* ${err}`, m);
  }
};

handler.help = ['حذف_الألقاب ⃝⚡'];
handler.tags = ['admin ⃝🌙'];
handler.command = ['حذف_الألقاب', 'حذف_الالقاب'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
