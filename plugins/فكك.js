import fs from "fs";

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn }) => {

    conn.tekateki = conn.tekateki || {};
    let id = m.chat;

    if (id in conn.tekateki) {
        await m.react("⏳");
        return conn.reply(
            m.chat,
            "⏳⃝⚡ *هـنـاك سـؤال قـائـم بـالـفـعـل، انـتـظـر انـتـهـاء الـجـولـة!*",
            conn.tekateki[id][0]
        );
    }

    if (!fs.existsSync("./src/game/miku.json")) {
        return m.reply("❌⃝❄ *ملف الأسئلة غير موجود!*");
    }

    let tekateki = JSON.parse(
        fs.readFileSync("./src/game/miku.json")
    );

    let json = tekateki[Math.floor(Math.random() * tekateki.length)];

    let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🧩⃝⚡ *لـعـبـة "فـكـك الـكـلـمـة"*

💡⃝⚡ *الـكـلـمـة:* ${json.question}

⏰⃝⚡ *الـوقـت:* ${(timeout / 1000).toFixed(0)} ثـانـيـة
💰⃝⚡ *الـجـائـزة:* ${poin} نـقـطـة
👤⃝⚡ *الـلاعـب:* @${m.sender.split("@")[0]}

⚡ *أرسـل الإجـابـة الـآن!*

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
© ʙʏ ʀɪʏᴀᴅ`.trim();

    let sent = await conn.reply(
        m.chat,
        caption,
        m,
        { mentions: [m.sender] }
    );

    conn.tekateki[id] = [
        sent,
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {

                await conn.reply(
                    m.chat,
                    `⏰⃝⚡ *انـتـهـى الـوقـت الـمـحـدد!*\n✅ *الإجـابـة الـصـحـيـحـة:* ${json.response}\n\n© ʙʏ ʀɪʏᴀᴅ`,
                    sent
                );

                delete conn.tekateki[id];
            }
        }, timeout)
    ];

    await m.react("✍️");
};

handler.help = ["فكك"];
handler.tags = ["game"];
handler.command = /^(فكك)$/i;

export default handler;