let handler = async (m, { conn, text, command, args }) => {

    let user = global.db.data.users[m.sender];

    if (!user) {
        global.db.data.users[m.sender] = {
            money: 0,
            bank: 0,
            lastDaily: 0
        };
        user = global.db.data.users[m.sender];
    }

    /* 💰 كشف الحساب */
    if (command === "فلوس" || command === "bal") {

        await m.react("💰");

        return conn.reply(m.chat,
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

🏦⃝⚡ *كـشـف الـحـسـاب الـمـالـي*

👤⃝⚡ *الـمـسـتـخـدم:* @${m.sender.split("@")[0]}

💵⃝⚡ *الـكـاش:* ${user.money.toLocaleString()}
💳⃝⚡ *الـبـنـك:* ${user.bank.toLocaleString()}
💰⃝⚡ *الـإجـمـالـي:* ${(user.money + user.bank).toLocaleString()}

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
© ʙʏ ʀɪʏᴀᴅ`, m, { mentions: [m.sender] });
    }

    /* 🎁 اليومية */
    if (command === "يومي") {

        let cooldown = 86400000;

        if (Date.now() - user.lastDaily < cooldown) {

            let remaining = (user.lastDaily + cooldown) - Date.now();

            let hours = Math.floor((remaining / 3600000) % 24);
            let minutes = Math.floor((remaining / 60000) % 60);

            await m.react("⏳");

            return conn.reply(m.chat,
`⏳⃝⚡ *يـمـكـنـك طـلـب الـيـومـيـة بـعـد:*
⏰⃝⚡ *${hours} سـاعـة و ${minutes} دقـيـقـة*`,
            m);
        }

        let amount = Math.floor(Math.random() * 5000) + 2000;

        user.money += amount;
        user.lastDaily = Date.now();

        await m.react("✅");

        return conn.reply(m.chat,
`🎁⃝⚡ *تـم اسـتـلام الـمـكـافـأة الـيـومـيـة!*
💰⃝⚡ *الـمـبـلـغ:* ${amount.toLocaleString()}

© ʙʏ ʀɪʏᴀᴅ`, m);
    }

    /* 💸 التحويل */
    if (command === "تحويل") {

        let target = m.mentionedJid?.[0];
        let amount = parseInt(args[1]);

        if (!target)
            return m.reply("⚠️⃝⚡ *مـنـشـن الـشـخـص لـلـتـحـويـل!*");

        if (!amount || amount < 1)
            return m.reply("🔢⃝⚡ *حـدد مـبـلـغـاً صـحـيـحـاً!*");

        if (user.money < amount)
            return m.reply("❌⃝❄ *رصـيـدك الـنـقـدي لا يـكـفـي!*");

        let targetUser = global.db.data.users[target];

        if (!targetUser) {
            global.db.data.users[target] = { money: 0, bank: 0 };
            targetUser = global.db.data.users[target];
        }

        user.money -= amount;
        targetUser.money += amount;

        await m.react("✅");

        return conn.reply(m.chat,
`💸⃝⚡ *تـم الـتـحـويـل بـنـجـاح!*
👤⃝⚡ *الـمـسـتـلـم:* @${target.split("@")[0]}
💰⃝⚡ *الـمـبـلـغ:* ${amount.toLocaleString()}

© ʙʏ ʀɪʏᴀᴅ`, m,
{ mentions: [target] });
    }
};

handler.help = ["فلوس", "يومي", "تحويل"];
handler.tags = ["economy"];
handler.command = /^(فلوس|bal|يومي|تحويل)$/i;

export default handler;