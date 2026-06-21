const itemMapping = {
    money: "💲⃝⚡ نــقــود",
    exp: "🆙⃝⚡ الــخــبــرة",
    trash: "🗑️⃝⚡ قــمــامــة",
    potion: "🏺⃝⚡ جــرعــة",
    diamond: "💎⃝⚡ الــمــاس",
    wood: "🪵⃝⚡ خــشــب",
    rock: "🪨⃝⚡ حــجــر",
    string: "🕸️⃝⚡ خــيــط",
    emerald: "✳️⃝⚡ زمــــرد",
    berlian: "⚙️⃝⚡ فــضــة",
    iron: "🔩⃝⚡ حــديــد",
    pet: "🐾⃝⚡ حــيــوان",
    petFood: "🍖⃝⚡ لــحــم",
    joincount: "🪙⃝⚡ ذهــــب",
    uncommon: "شائع",
    common: "نادر",
    legendary: "اسطوري",
    mythic: "خرافي"
};

function getArabicItemName(item) {
    return itemMapping[item] || item;
}

const rewards = {
    uncommon: {
        money: 1501, exp: 4001, joincount: 100, trash: 351,
        potion: [0, 1],
        diamond: [0, 1],
        common: [0, 1],
        uncommon: [0, 1],
        wood: [0, 1],
        rock: [0, 1],
        string: [0, 1]
    },

    common: {
        money: 2001, exp: 5001, joincount: 200, trash: 501,
        potion: [0, 1],
        common: [0, 1],
        legendary: [0, 1],
        uncommon: [0, 1]
    },

    legendary: {
        money: 1501, exp: 7000, berlian: 350, trash: 901,
        potion: [0, 1],
        emerald: [0, 1],
        diamond: [0, 1],
        joincount: [0, 1],
        iron: [0, 1],
        common: [0, 1],
        uncommon: [0, 1],
        legendary: [0, 1],
        mythic: [0, 1],
        pet: [0, 1],
        wood: [0, 1],
        rock: [0, 1],
        string: [0, 1]
    },

    mythic: {
        money: 4000, exp: 8000, joincount: 500, trash: 1400,
        potion: [0, 1],
        emerald: [0, 1],
        diamond: [0, 1],
        berlian: [0, 1],
        iron: [0, 1],
        common: [0, 1],
        uncommon: [0, 1],
        legendary: [0, 1],
        mythic: [0, 1],
        pet: [0, 1]
    }
};

let handler = async (m, { command, args, usedPrefix }) => {

    await m.react("📦");

    let user = global.db.data.users[m.sender] || {};

    let listCrate = Object.fromEntries(
        Object.entries(rewards).filter(([v]) => v && v in user)
    );

    let type = (args[0] || "").toLowerCase();

    type = Object.keys(itemMapping).find(
        key => itemMapping[key].includes(type)
    ) || type;

    let info = `⚡ *اســتــخــدم الــتــنــســيــق:*
📅⃝⚡ ${usedPrefix}${command} [الـصـنـدوق] [الـعـدد]

💡⃝⚡ *مــثــال:* ${usedPrefix}${command} اسطوري 10

🧰⃝⚡ *قــائــمــة الــصــنــاديــق الـمـتـوفـرة:*
${Object.keys(listCrate).map(v =>
    `*┇ ${getArabicItemName(v)} ┇ الـعـدد: ${user[v] || 0}*`
).join("\n")}`.trim();

    let count = isNumber(args[1])
        ? Math.max(1, parseInt(args[1]))
        : 1;

    if (!(type in listCrate)) return m.reply(info);

    if ((user[type] || 0) < count) {
        await m.react("❌");

        return m.reply(
            `❌⃝❄ *الـصـنـاديـق لا تـكـفـي!*\n` +
            `⚡ تـمـلـك: ${user[type] || 0} مـن ${getArabicItemName(type)}\n\n` +
            `💡⃝⚡ *لـلـشـراء:* .شراء ${getArabicItemName(type)} ${count - (user[type] || 0)}`
        );
    }

    let crateReward = {};

    for (let i = 0; i < count; i++) {
        for (let [reward, value] of Object.entries(listCrate[type])) {

            if (!(reward in user)) continue;

            let total = Array.isArray(value)
                ? value[Math.floor(Math.random() * value.length)]
                : value;

            if (total) {
                user[reward] = (user[reward] || 0) + total;
                crateReward[reward] =
                    (crateReward[reward] || 0) + total;
            }
        }
    }

    user[type] -= count;

    let resultText = `✅ *تـم فـتـح ${count} صـنـدوق ${getArabicItemName(type)}*\n\n🎁⃝⚡ *الـجـوائـز:* \n`;

    resultText += Object.keys(crateReward)
        .filter(v => crateReward[v] && !/legendary|pet|mythic|diamond|emerald/i.test(v))
        .map(reward =>
            `• ${getArabicItemName(reward)}: ${crateReward[reward]}`
        ).join("\n");

    await m.reply(resultText.trim());

    await m.react("✅");

};

handler.help = ["فتح"];
handler.tags = ["econ"];
handler.command = /^(فتح|open|buka|gacha)$/i;

export default handler;

function isNumber(x) {
    return typeof x === "number" && !isNaN(x);
}