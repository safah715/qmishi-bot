const handler = async function(m, { conn, text }) {
  try {
    const groupId = m.chat;
    const name = text?.trim();

    if (!name) throw `> \`❌ أدخل اللقب\``;

    const users = global.db?.data?.users || {};

    let taken = false;
    for (let key in users) {
      const user = users[key];
      if (user.groups?.[groupId]?.name?.toLowerCase() === name.toLowerCase()) {
        taken = true;
        break;
      }
    }

    if (taken) {
      await conn.reply(m.chat, `> \`❌ اللقب غير متاح\` ⚠️\n\n\`اللقب "${name}" محجوز بالفعل\``, m);
    } else {
      await conn.reply(m.chat, `> \`✅ اللقب متاح\` ✓\n\n\`اللقب "${name}" متاح للحجز\``, m);
    }

  } catch (err) {
    await conn.reply(m.chat, `${err}`, m);
  }
};

handler.admin = false;
handler.group = true;
handler.command = /^(متوفر|available)$/i;

export default handler;