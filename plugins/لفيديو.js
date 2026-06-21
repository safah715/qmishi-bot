import { webp2mp4 } from "../lib/webp2mp4.js";
import { ffmpeg } from "../lib/converter.js";

let handler = async (m, { conn, usedPrefix, command }) => {

    try {

        await m.react("⏳");

        if (!m.quoted)
            return m.reply(
`⚡ *قم بالرد على الاستيكر أو الوسائط*

📌 مثال:
${usedPrefix + command}`
            );

        let quoted = m.quoted;
        let mime = quoted.mimetype || quoted.msg?.mimetype || "";

        if (!/(webp|audio|image|video)/.test(mime))
            return m.reply("❌⃝❄ *الملف غير مدعوم*");

        let media = await quoted.download();

        if (!media)
            throw new Error("فشل تحميل الملف");

        let result = null;

        /* ===== تحويل حسب النوع ===== */

        if (/webp/.test(mime)) {
            result = await webp2mp4(media);
        }

        else if (/audio/.test(mime)) {
            result = await ffmpeg(media, [
                "-filter_complex", "color",
                "-pix_fmt", "yuv420p",
                "-crf", "51",
                "-c:a", "copy",
                "-shortest"
            ], "mp3", "mp4");
        }

        else if (/image/.test(mime)) {
            result = await ffmpeg(media, [
                "-loop", "1",
                "-i", "pipe:0",
                "-c:v", "libx264",
                "-t", "6",
                "-pix_fmt", "yuv420p",
                "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2"
            ], "png", "mp4");
        }

        else if (/video/.test(mime)) {
            result = media;
        }

        if (!result)
            throw new Error("فشل استخراج الفيديو");

        const caption =
`*╭━━━ ✅ تم التحويل ━━⃝⚡*
*│* ⚡ الحالة: تم بنجاح
*│* ⏰⃝⚡ المهمة: تحويل إلى فيديو
*╰━━━━━━━━━━━━━⃝🌙*

© ʙʏ ʀɪʏᴀᴅ`;

        await m.react("✅");

        if (Buffer.isBuffer(result)) {

            await conn.sendMessage(m.chat, {
                video: result,
                mimetype: "video/mp4",
                fileName: "converted.mp4",
                caption
            }, { quoted: m });

        } else if (typeof result === "string") {

            await conn.sendMessage(m.chat, {
                video: { url: result },
                caption
            }, { quoted: m });

        }

    } catch (err) {

        await m.react("❌");

        m.reply(`❌⃝❄ فشل التنفيذ: ${err.message}`);

    }
};

handler.help = ["لفيديو"];
handler.tags = ["sticker"];
handler.command = /^(لفيديو|tomp4|لمقطع|لفديو)$/i;

export default handler;