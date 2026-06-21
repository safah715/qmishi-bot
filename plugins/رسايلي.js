/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

let handler = async (m, { conn, participants, groupMetadata, command }) => {
    if (!global.groupData) global.groupData = {};
    const chatId = m.chat;

    if (!global.groupData[chatId]) global.groupData[chatId] = {};
    const groupUsers = global.groupData[chatId];

    // تأمين وجود بيانات العضو
    if (!groupUsers[m.sender]) groupUsers[m.sender] = { messagesSent: 0 };

    let profilePicture;
    try {
        profilePicture = await conn.profilePictureUrl(m.sender, 'image');
    } catch {
        profilePicture = 'https://files.catbox.moe/js0p2j.jpg'; // فيديو افتراضي في حال عدم وجود صورة
    }

    const groupName = groupMetadata.subject;

    // 1. عـرض إحـصـائـيـات الـفـرد 📨⃝⚡
    if (command === 'رسائلي' || command === 'رسايلي') {
        const messagesSent = groupUsers[m.sender].messagesSent || 0;
        
        const caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
                        `📊⃝⚡ *إحـصـائـيـات رسـائـلـك:* \n\n` +
                        `> 👤 *الـمـسـتـخـدم:* @${m.sender.split('@')[0]}\n` +
                        `> 👥 *الـمـجـمـوعـة:* ${groupName}\n` +
                        `> 📨 *الـرسـائـل:* ${messagesSent}\n\n` +
                        `⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

        await conn.sendMessage(m.chat, {
            image: { url: profilePicture },
            caption: caption,
            mentions: [m.sender]
        }, { quoted: m });
        await m.react('✅');
        
    // 2. عـرض إجـمـالـي الـمـجـمـوعـة 🏆⃝⚡
    } else if (command === 'اجمالي') {
        const sortedUsers = Object.entries(groupUsers)
            .filter(([jid]) => participants.some(p => p.id === jid)) // تصفية الأعضاء الموجودين فقط
            .sort((a, b) => b[1].messagesSent - a[1].messagesSent);

        const totalMessages = sortedUsers.reduce((sum, u) => sum + (u[1].messagesSent || 0), 0);
        const totalMembers = participants.length;

        let resultMessage = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
                           `📊⃝⚡ *إحـصـائـيـات الـمـجـمـوعـة:* \n\n` +
                           `> 📌 *الـمـجـمـوعـة:* ${groupName}\n` +
                           `> 👥 *الـأعـضـاء:* ${totalMembers}\n` +
                           `> 📨 *الـإجـمـالـي:* ${totalMessages}\n\n`;

        if (sortedUsers.length > 0) {
            const king = sortedUsers[0];
            resultMessage += `👑⃝⚡ *مـلـك الـتـفـاعـل:* \n` +
                           `> @${king[0].split('@')[0]} بـرصـيـد (${king[1].messagesSent}) رسـالـة\n\n`;
        }

        resultMessage += `🏆⃝⚡ *تـرتـيـب الـأعـضـاء (Top 10):* \n`;

        sortedUsers.slice(0, 10).forEach(([user, data], i) => {
            resultMessage += `*${i + 1}.* @${user.split('@')[0]} ⇽ (${data.messagesSent})\n`;
        });

        resultMessage += `\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`;

        await conn.sendMessage(m.chat, {
            image: { url: profilePicture },
            caption: resultMessage,
            mentions: sortedUsers.slice(0, 10).map(([user]) => user)
        }, { quoted: m });
        await m.react('✅');
    }
};

// ⚡ تـحـديـث الـعـداد تـلـقـائـيـاً
handler.all = async (m) => {
    if (!m.text || !m.isGroup) return;
    const chatId = m.chat;
    if (!global.groupData) global.groupData = {};
    if (!global.groupData[chatId]) global.groupData[chatId] = {};

    const groupUsers = global.groupData[chatId];
    if (!groupUsers[m.sender]) groupUsers[m.sender] = { messagesSent: 0 };
    groupUsers[m.sender].messagesSent += 1;
};

handler.help = ['رسائلي ⃝⚡', 'اجمالي ⃝🌙'];
handler.tags = ['stats ⃝⚡'];
handler.command = ['رسائلي', 'رسايلي', 'اجمالي'];
handler.group = true;
handler.register = true;

export default handler;
