const handler = async function(m, { conn, text }) {
  try {
    const users = global.db?.data?.users || {};
    const groupId = m.chat;
    let mentionedJid;

    if (m.quoted && m.quoted.sender) {
      mentionedJid = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
      mentionedJid = m.mentionedJid[0];
    } else {
      throw `> \`❌ حدد العضو\``;
    }

    const user = users[mentionedJid];

    if (!user || !user.groups || !user.groups[groupId]?.name) {
      throw `> \`❌ لا يملك لقباً\``;
    }

    const nickname = user.groups[groupId].name;
    await conn.reply(m.chat, `> \`🏷️ لقب العضو\` 👤\n\n\`${nickname}\``, m);

  } catch (err) {
    await conn.reply(m.chat, `${err}`, m);
  }
};

handler.group = true;
handler.command = /^(لقبه|nickname)$/i;

export default handler;