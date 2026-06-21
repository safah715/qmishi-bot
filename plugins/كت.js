import fs from 'fs';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    if (id in conn.tekateki) {
        return conn.reply(m.chat, `*╭━━━ 𝑴𝑨𝑺𝑯 𝐆𝐀𝐌𝐄 ━━⃝⚡*\n*│* ⚠️⃝⚡ *هـناك سـؤال لـم يـنـتـه بـعد!*\n*╰━━━━━━━━━━━━━⃝🌙*`, conn.tekateki[id][0]);
    }

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/كت.json`));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    let caption = `*╭━━━ 𝑴𝑨𝑺𝑯 𝐆𝐀𝐌𝐄 ━━⃝⚡*\n`
    caption += `*│* ⚡ *الـسـؤال:* ${json.question}\n`
    caption += `*│* ⏳⃝⚡ *الـوقـت:* ${(timeout / 1000).toFixed(0)} ثـانـيـة\n`
    caption += `*│* 💰⃝⚡ *الـجـائـزة:* ${poin} نـقـطة\n`
    caption += `*╰━━━━━━━━━━━━━⃝🌙*\n\n`
    caption += ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n`
    caption += `*© ʙʏ ʀɪʏᴀᴅ*`.trim();

    await m.react('⏳⃝⚡');

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m, { mentions: [m.sender] }),
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `*╭━━━ 𝐓𝐈𝐌𝐄 𝐎𝐔𝐓 ━━⃝⚡*\n*│* ⏰⃝⚡ *انـتهى الـوقت!*\n*│* ✅ *الإجـابة:* ${json.response}\n*╰━━━━━━━━━━━━━⃝🌙*\n\n*© ʙʏ ʀɪʏᴀᴅ*`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = ['كت ⃝⚡'];
handler.tags = ['game ⃝🌙'];
handler.command = /^(كت)$/i;

export default handler;
