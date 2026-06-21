/*
تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁
*/

import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

const handler = async (m, { conn, isAdmin, isOwner }) => {
  // التحقق من الصلاحيات ⏳⃝⚡
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  // تفاعل البدء
  await m.react('⏳⃝⚡');

  const coverImageUrl = 'https://files.catbox.moe/h6eq19.jpg';
  const media = await prepareWAMessageMedia(
    { image: { url: coverImageUrl } },
    { upload: conn.waUploadToServer }
  );

  // إعداد القائمة
  const sections = [
    { emoji: '🔓', title: 'فتح الجروب', id: '.جروب_فتح' },
    { emoji: '🔐', title: 'قفل الجروب', id: '.جروب_قفل' }
  ].map(s => ({
    title: `★ ${s.title} ⃝⚡`,
    highlight_label: '𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡',
    rows: [{ 
      header: s.emoji, 
      title: `${s.title}`, 
      id: s.id, 
      description: '© ʙʏ ʀɪʏᴀᴅ' 
    }]
  }));

  const caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *لـوحـة تـحـكـم الـمـجـمـوعـة:*

> 🔓⃝⚡ *فـتـح الـمـجـمـوعـة*
> 🔐⃝⚡ *قـفـل الـمـجـمـوعـة*

⚠️⃝⚡ *تـنـبـيـه:* هـذه الـأوامـر خـاصـة بـالـمـشـرفـيـن فـقـط.

⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

  const msg = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: caption },
          footer: { text: `© ʙʏ ʀɪʏᴀᴅ` },
          header: { 
            hasMediaAttachment: true, 
            subtitle: ' ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙',
            ...media 
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "📋⃝⚡ اخـتـر الـإجـراء",
                  sections: sections
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "📢⃝🌙 الـقـنـاة الـرسـمـيـة",
                  url: "https://whatsapp.com/channel/0029Vb7O26W8V0tu5ErixM1d"
                })
              }
            ]
          }
        }
      }
    }
  };

  await conn.relayMessage(m.chat, msg, {});
  await m.react('✅');
};

handler.help = ['جروب ⃝⚡'];
handler.tags = ['group ⃝🌙'];
handler.command = /^(جروب)$/i;
handler.admin = true;
handler.group = true;

export default handler;
