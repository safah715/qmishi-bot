import fetch from 'node-fetch';
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  try {
    await m.react('⚡');
    
    // إرسال المقطع الصوتي الترحيبي
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: 'https://files.catbox.moe/051o6g.mp3' },
        mimetype: 'audio/mp4',
        ptt: false
      },
      { quoted: m }
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

    // إعداد بطاقة المطور (VCARD)
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:ʀɪʏᴀᴅ 𝅄 ۫ ִᗀᩙᰰ
TEL;type=CELL;waid=967783916451:+967783916451
ORG:NINO BOT DEVELOPER
END:VCARD`;

    // نص الرسالة المنسق بالهوية المتموجة
    const messageText = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆👤 الـمـطـور : القميشي*
*⃝🌙┆🛠️ الـنـظـام : 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

*⃝⚡┆📜 قـوانـيـن الـتـواصـل :*
*⃝🌙┆❶ ابدأ حـديـثـك بـتـحـيـة الإسـلام*
*⃝⚡┆❷ لا تـسأل عـن أشـياء مـوجـودة بـالـمـنـيـو*
*⃝🌙┆❸ الـتواصل للـضرورة أو الـتطوير فـقط*

*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`;

    // إنشاء رسالة الأزرار التفاعلية
    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: `© ʙʏ القميشي`
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: `*〘 👑 مـطـور الـنـظـام 〙*`,
              hasMediaAttachment: true,
              ...(await generateWAMessageContent({ image: { url: 'https://files.catbox.moe/rhpup3.jpg' } }, { upload: conn.waUploadToServer }))
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "⃝⚡ قـائـمـة الـخـيارات",
                    sections: [
                      {
                        title: "الـتواصل مـع ʀɪʏᴀᴅ",
                        rows: [
                          { title: "⃝🌙 بـطاقة المـطور", description: "عـرض مـلف الـتواصل المباشر", id: ".vcard" }
                        ]
                      }
                    ]
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "⃝⚡ قـناة الـبـوت",
                    url: "https://chat.whatsapp.com/K95y2F8zwGT4OfAk8xH0MB"
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "⃝🌙 مـراسـلـة واتـسـاب",
                    url: "https://wa.me/967783916451"
                  })
                }
              ]
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    // إرسال البطاقة لسهولة الحفظ
    await conn.sendMessage(m.chat, { contacts: { displayName: "ʀɪʏᴀᴅ", contacts: [{ vcard }] } }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('*⃝⚡┆⚠️ عذراً، حدث خطأ في استحضار واجهة المطور*');
  }
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|المطور|مطور)$/i;

export default handler;
