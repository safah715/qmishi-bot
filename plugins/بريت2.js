/*
تـم الـتـنـسـيـق بـواسـطـة:  ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
الـمـطـور الـحـقـيـقـي: EsCANoR 🍁
*/

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    let tempFilePath;
    let tempStickerPath;
    
    try {
        await m.react('⏳⃝⚡');

        if (!text) {
            await m.react('❔⃝🌙');
            return conn.reply(m.chat, 
                ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                `*⚡ نـص مـفـقـود*\n` +
                `*❌⃝❄ يـجـب كـتـابـة نـص بـعـد الأمـر*\n` +
                `*💡⃝⚡ مـثـال: ${usedPrefix + command} 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧*\n\n` +
                `© ʙʏ ʀɪʏᴀᴅ`, 
                m
            );
        }

        const tempDir = './temp';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        tempFilePath = path.join(tempDir, `brat2_temp_${Date.now()}.mp4`);
        tempStickerPath = path.join(tempDir, `brat2_sticker_${Date.now()}.webp`);

        const apis = [
            { name: "ZellAPI", url: `https://apizell.web.id/tools/bratanimate?q=${encodeURIComponent(text)}` },
            { name: "SiputzxAPI", url: `https://api.siputzx.my.id/api/m/bratvideo?text=${encodeURIComponent(text)}` },
            { name: "MayAPI", url: `https://mayapi.ooguy.com/bratvideo`, params: { apikey: 'may-051b5d3d', text: text } }
        ];

        let apiUsed = null;

        for (const api of apis) {
            try {
                const response = await axios({
                    method: 'GET',
                    url: api.url,
                    params: api.params || {},
                    responseType: 'arraybuffer',
                    timeout: 10000
                });

                const mediaBuffer = Buffer.from(response.data);
                if (!mediaBuffer || mediaBuffer.length < 100) continue;

                fs.writeFileSync(tempFilePath, mediaBuffer);
                const firstBytes = mediaBuffer.slice(0, 12);
                const isWebP = firstBytes.slice(0, 4).toString() === 'RIFF' && firstBytes.slice(8, 12).toString() === 'WEBP';
                
                if (isWebP) {
                    fs.writeFileSync(tempStickerPath, mediaBuffer);
                    apiUsed = api.name;
                    break;
                }
                
                const ffmpegCommand = `ffmpeg -i "${tempFilePath}" -vcodec libwebp -filter:v fps=fps=15 -lossless 0 -qscale 70 -loop 0 -s 512:512 "${tempStickerPath}" -y`;
                await execAsync(ffmpegCommand, { timeout: 20000 });
                apiUsed = api.name;
                break;
                
            } catch (e) { continue; }
        }

        if (!apiUsed || !fs.existsSync(tempStickerPath)) throw new Error('فشل التحويل');

        await m.react('✅');
        const stickerBuffer = fs.readFileSync(tempStickerPath);
        
        await conn.sendMessage(m.chat, {
            sticker: stickerBuffer,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 `,
                    body: `© ʙʏ ʀɪʏᴀᴅ`,
                    thumbnailUrl: 'https://files.catbox.moe/mshkf2.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb7O26W8V0tu5ErixM1d',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        setTimeout(() => {
            try {
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
                if (fs.existsSync(tempStickerPath)) fs.unlinkSync(tempStickerPath);
            } catch (e) {}
        }, 10000);

    } catch (error) {
        await m.react('❌⃝❄');
        await conn.reply(m.chat, `*❌⃝❄ حـدث خـطأ أثـنـاء صـنـع الـمـلـصـق*`, m);
    }
};

handler.help = ['بريت2 ⃝⚡'];
handler.tags = ['sticker ⃝🌙'];
handler.command = ['بريت2', 'برات2'];
handler.group = true;

export default handler;
