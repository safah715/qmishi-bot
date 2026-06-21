import { createRequire } from "module";
const require = createRequire(import.meta.url);

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let tempStickerPath;

    try {
        await m.react("🕒");

        if (!text) {
            await m.react("❔");

            return conn.reply(m.chat,
` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙

*⃝⚡ نـص مـفـقـود*
*⃝🌙 يـجـب كـتـابـة نـص بـعـد الأمـر*
*⃝⚡ مـثـال: ${usedPrefix + command} نص هنا*

© ʙʏ ʀɪʏᴀᴅ`, m);
        }

        const tempDir = "./temp";

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        tempStickerPath = path.join(tempDir, `brat_sticker_${Date.now()}.webp`);

        const mayApiUrl = "https://mayapi.ooguy.com/brat";
        const fallbackApiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;

        let imageData;

        try {
            const apiResponse = await axios.get(mayApiUrl, {
                params: {
                    apikey: "may-f53d1d49",
                    text: text
                },
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const imageUrl = apiResponse.data?.result?.url;

            if (!imageUrl) throw new Error("API1 Failed");

            const imageResponse = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });

            imageData = Buffer.from(imageResponse.data);

        } catch {
            const fallbackResponse = await axios.get(fallbackApiUrl, {
                responseType: "arraybuffer"
            });

            imageData = Buffer.from(fallbackResponse.data);
        }

        const isWebP = imageData.slice(0, 4).toString() === "RIFF";

        if (!isWebP) {
            const ffmpegCommand =
                `ffmpeg -i pipe:0 -vcodec libwebp -lossless 0 -qscale 70 -loop 0 -s 512:512 "${tempStickerPath}" -y`;

            await execAsync(
                `echo "${imageData.toString("base64")}" | base64 -d | ${ffmpegCommand}`
            );

        } else {
            fs.writeFileSync(tempStickerPath, imageData);
        }

        await m.react("✅");

        const stickerMetadata = {
            pack: "𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙",
            author: "© ʙʏ ʀɪʏᴀᴅ",
            type: StickerTypes.FULL
        };

        const sticker = new Sticker(
            fs.readFileSync(tempStickerPath),
            stickerMetadata
        );

        await conn.sendMessage(
            m.chat,
            await sticker.toMessage(),
            { quoted: m }
        );

        setTimeout(() => {
            if (tempStickerPath && fs.existsSync(tempStickerPath)) {
                fs.unlinkSync(tempStickerPath);
            }
        }, 10000);

    } catch (error) {
        console.error(error);
        await m.react("❌");
        await conn.reply(m.chat,
            "*⃝⚡ حـدث خـطـأ أثـنـاء صـنـع الـمـلـصـق*",
            m
        );
    }
};

handler.help = ["brat"];
handler.tags = ["sticker"];
handler.command = /^(بريت|برات)$/i;
handler.group = true;

export default handler;