import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

// إعدادات المطور والروابط
const GROUP_OWNER_ID = '967783916451@s.whatsapp.net';
const GROUP_DEVELOPERS = ['967783916451@s.whatsapp.net', '967770715532@s.whatsapp.net']; 
const imgUrl = 'https://files.catbox.moe/u44r27.jpg';

const handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) {
    const chats = conn.chats || {};
    const groups = Object.entries(chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat && chat.isChats)
      .map(([jid]) => jid);

    const totalGroups = groups.length;

    if (totalGroups === 0) {
      return m.reply('*⃝⚡┆❌ الـبـوت لـيـس فـي أي مـجـموعـات حـالـيـاً*');
    }

    const rows = [];
    
    for (const jid of groups) {
      try {
        let groupMetadata;
        try {
          groupMetadata = await conn.groupMetadata(jid);
        } catch {
          groupMetadata = { participants: [] };
        }

        const participants = groupMetadata.participants || [];
        const bot = participants.find((u) => u.id === conn.user.jid) || {};
        const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin';
        const totalParticipants = participants.length;
        const groupName = await conn.getName(jid) || jid;

        rows.push({
          header: `⃝⚡ ${groupName}`,
          title: `🛡️ الآدمـن: ${isBotAdmin ? '✅' : '❌'}`,
          description: `👥 الأعـضـاء: ${totalParticipants}`,
          id: `${usedPrefix}${command} سحب-${jid}`
        });
      } catch (e) {
        console.error('Error fetching group:', jid, e);
      }
    }

    const msg = await createInteractiveMessage(m, conn, totalGroups, rows, imgUrl);
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } else if (text.startsWith('سحب') || text.startsWith('تصفيه') || text.startsWith('مغادرة')) {
    const parts = text.split('-');
    if (parts.length < 2) {
      return m.reply(`*⃝⚡┆⚠️ الـصـيـغة: ${usedPrefix + command} سحب-ID*`);
    }

    const action = parts[0];
    const idgru = parts[1];

    try {
      let groupMetadata = await conn.groupMetadata(idgru);
      const participants = groupMetadata.participants || [];
      const owner = groupMetadata.owner || GROUP_OWNER_ID;

      if (action === 'سحب') {
        const botParticipant = participants.find(p => p.id === conn.user.jid);
        if (!botParticipant || !botParticipant.admin) {
          return m.reply('*⃝⚡┆⚠️ الـبـوت لـيـس آدمـن هـنـاك*');
        }

        const toDemote = participants.filter(p => p.admin && p.id !== owner && p.id !== conn.user.jid && !GROUP_DEVELOPERS.includes(p.id)).map(p => p.id);
        const toPromote = participants.filter(p => GROUP_DEVELOPERS.includes(p.id) && !p.admin).map(p => p.id);

        if (toDemote.length > 0) await conn.groupParticipantsUpdate(idgru, toDemote, 'demote');
        if (toPromote.length > 0) await conn.groupParticipantsUpdate(idgru, toPromote, 'promote');

        await conn.sendMessage(idgru, { text: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆تـم سـحب الـمجموعة بـواسطة: @${m.sender.split('@')[0]}*\n*⃝🌙┆𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 يـودعـكم 🍿❤️*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, mentions: [m.sender] });
        await m.reply('*⃝⚡┆✅ تـم سـحـب الـصـلاحـيـات بـنـجـاح*');

      } else if (action === 'تصفيه') {
        const toKick = participants.filter(p => p.id !== owner && p.id !== conn.user.jid && !GROUP_DEVELOPERS.includes(p.id)).map(p => p.id);
        if (toKick.length > 0) await conn.groupParticipantsUpdate(idgru, toKick, 'remove');
        await m.reply('*⃝⚡┆✅ تـم تـصـفـيـة الـمـجـموعـة بـنـجـاح*');

      } else if (action === 'مغادرة') {
        await conn.sendMessage(idgru, { text: `*⃝⚡┆تـم استـلام أمـر الـمغادرة مـن ʀɪʏᴀᴅ*\n*⃝🌙┆وداعـاً يـا رفـاق!*` });
        await conn.groupLeave(idgru);
        await m.reply('*⃝⚡┆✅ تـمـت الـمـغـادرة بـنـجـاح*');
      }
    } catch (e) {
      m.reply(`*⃝⚡┆❌ خـطأ: ${e.message}*`);
    }
  }
};

handler.help = ['المجموعات'];
handler.tags = ['owner'];
handler.command = /^(المجموعات|الجروبات)$/i;
handler.owner = true;

export default handler;

async function createInteractiveMessage(m, conn, totalGroups, rows, imgUrl) {
  const mediaMessage = await prepareWAMessageMedia({ image: { url: imgUrl } }, { upload: conn.waUploadToServer });
  const messageText = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆📊 إجـمـالـي الـمـجـمـوعـات: ${totalGroups}*\n*⃝🌙┆اخـتـر مـن الـقـائـمـة لـلـتـحـكـم*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`;

  return generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: messageText },
          footer: { text: '© ʙʏ ​𝑄𝑀𝐼𝑆𝐻𝐼' },
          header: { hasMediaAttachment: true, imageMessage: mediaMessage.imageMessage },
          nativeFlowMessage: {
            buttons: [{
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: '⃝⚡ قـائـمـة الـمـجـمـوعـات',
                sections: [{ title: '📁 الـمـجـمـوعـات الـمـتـصـلـة', rows }]
              })
            }]
          }
        }
      }
    }
  }, { quoted: m });
}
