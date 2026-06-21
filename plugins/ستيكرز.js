/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Sticker } from 'wa-sticker-formatter';

async function gifsSearch(q) {
    try {
        const searchUrl = `https://tenor.com/search/${encodeURIComponent(q)}-gifs`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $("figure.UniversalGifListItem").each((i, el) => {
            const $el = $(el);
            const img = $el.find("img");
            const gifUrl = img.attr("src");
            if (gifUrl && gifUrl.endsWith('.gif')) {
                results.push({
                    gif: gifUrl,
                    alt: img.attr("alt") || "Nino Sticker"
                });
            }
        });
        return results;
    } catch (error) {
        return [];
    }
}

const handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) {
        await m.react('⚡');
        return m.reply(
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة الـاسـتـخـدام:*
قـم بـكـتـابـة اسـم الـشـخـصـيـة والـعـدد الـمـطـلـوب.
مـثـال: *${usedPrefix + command} لـوفـي 5*

⌬──══─┈•⤣⚡⤤•┈─══──⌬`);
    }

    await m.react('⏳⃝⚡');

    const args = text.split(' ');
    const query = args.slice(0, -1).join(' ') || args[0];
    const countStr = args.length > 1 ? args[args.length - 1] : '1';
    const count = Math.min(Math.max(parseInt(countStr) || 1, 1), 10); // حـد أقـصـى 10 لـتـفـادي الـحـظـر

    const results = await gifsSearch(query);
    if (!results.length) {
        await m.react('❌⃝❄');
        return m.reply('⚠️⃝⚡ لـم يـتـم الـعـثـور عـلـى نـتـائـج لـهـذا الـبـحـث.');
    }

    // اخـتـيـار عـشـوائـي لـلـنـتـائـج
    const shuffled = results.sort(() => 0.5 - Math.random());
    const picks = shuffled.slice(0, count);

    for (const pick of picks) {
        try {
            const { data } = await axios.get(pick.gif, { responseType: 'arraybuffer' });

            const sticker = new Sticker(data, {
                type: 'full',
                pack: '𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡',
                author: 'EsCANoR ⃝🌙',
                quality: 50
            });

            const buffer = await sticker.toBuffer();
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
        } catch (e) {
            console.error('Error creating sticker:', e);
        }
    }

    await m.react('✅');
};

handler.help = ['ستيكرز ⃝⚡'];
handler.tags = ['sticker ⃝🌙'];
handler.command = ['ستيكرز', 'gifsearch'];
handler.register = true;

export default handler;
