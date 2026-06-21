const handler = async function(m, { conn }) {
  try {
    const groupId = m.chat;
    const users = global.db?.data?.users || {};
    const user = users[m.sender];

    if (!user || !user.groups || !user.groups[groupId] || !user.groups[groupId].name) {
      throw `> \`❌ أنت غير مسجل\``;
    }

    const nickname = user.groups[groupId].name;
    await conn.reply(m.chat, `> \`🏷️ لقبك\` 👤\n\n\`${nickname}\``, m);

  } catch (err) {
    await conn.reply(m.chat, `${err}`, m);
  }
};

handler.group = true;
handler.command = /^(لقبي|mynickname)$/i;

export default handler;