/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import fetch from "node-fetch";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { FormData, Blob } from "formdata-node";
import { generateWAMessageFromContent, prepareWAMessageMedia } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime) {
      await m.react('⚡');
      return conn.reply(m.chat, 
`⌬──══─┈•⤣⚡⤤•┈─══──⌬
⚡ *يـرجـى الـرد عـلـى (صـورة/فـيـديـو/مـلـف):*
> لـتـحـويـلـه إلـى رابـط مـبـاشـر.
⌬──══─┈•⤣⚡⤤•┈─══──⌬`, m);
    }

    // ⏳⃝⚡ بـدء الـمـعـالـجـة
    await m.react('⚡');

    let media = await q.download();
    if (!media || media.length === 0) throw 'فـشـل تـحـمـيـل الـمـيـديـا';

    let link = await catbox(media);
    if (!link || link.includes("error")) throw 'فـشـل الـرفـع إلـى الـخـادم';

    let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
                  `✅ *تـم الـرفـع بـنـجـاح:* \n\n` +
                  `> 🔗 *الـرابـط:* ${link}\n` +
                  `> 📊 *الـحـجـم:* ${formatBytes(media.length)}\n` +
                  `> ⏳ *الـصـلاحـيـة:* دائـمـة\n\n` +
                  `⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

    // تـهـيـئـة الـمـيـديـا لـلـعرض فـي الـهـيـدر
    let mediaMsg = {};
    if (/image/.test(mime)) mediaMsg = { image: media };
    else if (/video/.test(mime)) mediaMsg = { video: media };
    else mediaMsg = { image: { url: 'https://files.catbox.moe/7h727z.mp4' } }; // افـتـراضـي لـلـمـلـفـات

    const preparedMedia = await prepareWAMessageMedia(mediaMsg, { upload: conn.waUploadToServer });

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "🍸 *Mash Bot Uploader* 🍸",
              hasMediaAttachment: true,
              ...(mediaMsg.image ? { imageMessage: preparedMedia.imageMessage } : { videoMessage: preparedMedia.videoMessage })
            },
            body: { text: caption },
            footer: { text: "© ʙʏ ʀɪʏᴀᴅ" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📎 نـسـخ الـرابـط",
                    copy_code: link,
                  }),
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🌐 فـتـح فـي الـمـتـصـفـح",
                    url: link,
                    merchant_url: link
                  }),
                }
              ],
            },
          },
        },
      },
    }, { userJid: conn.user.id, quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `⚠️⃝⚡ *حـدث خـطـأ:* ${e}`, m);
  }
};

handler.help = ['رابط ⃝⚡'];
handler.tags = ['tools ⃝🌙'];
handler.command = /^(رابط|ارفع|للرابط)$/i;

export default handler;

// --- الـدوال الـمـسـاعـدة ---
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  try {
    const type = await fileTypeFromBuffer(content);
    const { ext, mime } = type || { ext: 'bin', mime: 'application/octet-stream' };
    const blob = new Blob([content], { type: mime });
    const formData = new FormData();
    const random = crypto.randomBytes(5).toString("hex");

    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, `${random}.${ext}`);

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    return await res.text();
  } catch (err) {
    return "error";
  }
}
