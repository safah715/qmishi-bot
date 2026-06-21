const handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, '> *⚠️ الرد على الرسالة المراد حذفها*', m);
  }

  if (!(isAdmin || isOwner)) {
    return m.reply('❌ للمشرفين فقط');
  }

  try {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.quoted.id,
        participant: m.quoted.sender
      }
    });
  } catch {
    return m.reply('❌ لا يمكن حذف الرسالة');
  }
};

handler.help = ['حذف'];
handler.tags = ['group'];
handler.command = ['حذف', 'مسح', 'delete', 'del'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;