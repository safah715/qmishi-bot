import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    if (id in conn.tekateki) {
        await m.react( '⏳⃝⚡' )
        return conn.reply(m.chat, `⏳⃝⚡ *هـنـاك سـؤال قـائـم بـالـفـعـل، انـتـظـر انـتـهـاء الـوقـت أو أجـب عـلـيـه.*`, conn.tekateki[id][0]);
    }

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/عواصم.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🧧⃝⚡ *سـؤال جـديـد فـي الـعـواصـم*

⚡ *الـسـؤال:* مـا هـي عـاصـمـة 《 ${json.question} 》؟

👤⃝⚡ *الـلاعـب:* @${m.sender.split( '@' )[0]}
⏰⃝⚡ *الـوقـت:* ${(timeout / 1000).toFixed(2)} ثانية
💰⃝⚡ *الـجـائـزة:* ${poin} نقطة

✅ *أجـب بـسـرعـة لـتـفـوز بـالـنـقـاط!*

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim();

    await m.react( '⚡' )
    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m, { mentions: [m.sender] }),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n⏰⃝⚡ *انـتـهـى الـوقـت الـمـحـدد!*\n✅ *الـإجـابـة الـصـحـيـحـة هـي:* ${json.response}\n\n ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = [ 'عاصمه ⃝⚡' ];
handler.tags = [ 'game ⃝🌙' ];
handler.command = /^(عاصمه)$/i;

export default handler;
