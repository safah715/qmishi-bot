/* كاشف سجل الإنذارات - نظام الأزرار */

import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, usedPrefix, command }) => {

  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
  } else {
    who = m.chat;
  }

  if (!who) {
    return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆⚠️ يـرجـى الـرد عـلى رسـالة أو مـنـشـن الـعـضـو*
*⃝🌙┆مـثـال: ${usedPrefix + command} @user*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬 ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
    );
  }

  let user = global.db.data.users[who];
  let warnCount = user?.warn || 0;

  await m.react('📝');

  // جلب الأسباب إذا كانت مخزنة
  let warns = user?.warns || [];
  let list = warns.map((v, i) => `*⃝🌙┆${i + 1} - ${v.reason || 'بـدون سـبـب'}*`).join('\n');

  const messageText = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆📋 سـجـل الإنـذارات*
*⃝🌙┆الـعـضـو: @${who.split('@')[0]}*
*⃝⚡┆الـعـدد الإجـمـالي: ${warnCount}/3*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
${list || '*⃝🌙┆لا تـوجـد تـفـاصـيـل إضـافـيـة*'}`;

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: messageText
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "*〘 ✨ كـاشـف الـسـجـلات 〙*",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "⃝⚡ خـيـارات الـتـحـكـم",
                  sections: [
                    {
                      title: "إجراءات الإدارة",
                      rows: [
                        { title: "⃝🌙 إلغاء إنذار", description: "حذف إنذار واحد من السجل", id: `${usedPrefix}الغاء_انذار @${who.split('@')[0]}` },
                        { title: "⃝⚡ تحذير إضافي", description: "إضافة إنذار جديد للعضو", id: `${usedPrefix}warn @${who.split('@')[0]}` }
                      ]
                    }
                  ]
                })
              }
            ]
          }),
          contextInfo: {
            mentionedJid: [who]
          }
        })
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['انذارات'];
handler.tags = ['admin'];
handler.command = /^(الانذارات|انذارات|warnings)$/i;
handler.group = true;
handler.admin = true;

export default handler;
