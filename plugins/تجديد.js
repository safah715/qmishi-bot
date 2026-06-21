/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) 
    return m.reply(`⃝⚡ *هذا الأمر للمشرفين فقط*`);

  try {
    const groupId = m.chat;

    // تجديد رابط الدعوة
    const newInviteCode = await conn.groupRevokeInvite(groupId);
    const newLink = `https://chat.whatsapp.com/${newInviteCode}`;

    // الحصول على صورة الجروب
    let groupImage;
    try {
      groupImage = await conn.profilePictureUrl(groupId, 'image'); 
    } catch (e) {
      groupImage = 'https://files.catbox.moe/77xvkf.jpg'; // رابط الصورة الافتراضية
    }

    // تجهيز الميديا
    const media = await prepareWAMessageMedia(
      { image: { url: groupImage } },
      { upload: conn.waUploadToServer }
    );

    // النص المنسق
    const teks = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                 `⃝🌙 *تـم تـجـديـد رابـط الـدعـوَة بـنـجـاح*\n\n` +
                 `> ⃝⚡ *الـرابـط الـجـديـد:* \n${newLink}\n`;

    // إنشاء الرسالة التفاعلية مع الصورة والزر
    const msg = generateWAMessageFromContent(groupId, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: teks.trim() },
            footer: { text: `© ʙʏ ʀɪʏᴀᴅ` },
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: '⃝⚡ نـسـخ الـرابـط',
                    copy_code: newLink
                  })
                }
              ]
            }
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(groupId, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    m.reply(`⃝🌙 *حـدث خـطأ أثـنـاء تـجـديـد الـرابـط*`);
  }
};

handler.help = ['تجديد_لينك'];
handler.tags = ['group'];
handler.command = ['تجديد_لينك', 'تجديد'];
handler.group = true;
handler.admin = true;

export default handler;
