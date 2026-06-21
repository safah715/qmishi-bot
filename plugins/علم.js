import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    if (command.startsWith('اجاب_')) {
        let id = m.chat;
        let obito = conn.obito ? conn.obito[id] : null;

        if (!obito) {
            await m.react('⏳⃝⚡');
            return conn.reply(m.chat, `⏳⃝⚡ *لا تـوجـد لـعـبـة نـشـطـة الآن*`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await m.react('✅');
            // تم حذف الأسماء من هنا لتظهر مرة واحدة فقط في البداية
            await conn.reply(m.chat, `✅ *إجـابـة صـحـيـحـة يـا بـطـل!*\n💰⃝⚡ *الـجـائـزة:* 500xp`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await m.react('❌⃝❄');
                // تم حذف الأسماء من هنا
                await conn.reply(m.chat, `❌⃝❄ *إجـابـة خـاطـئـة!*\n🔄⃝⚡ *مـحـاولات مـتـبـقـيـة:* ${obito.attempts}`, m);
            } else {
                await m.react('❌⃝❄');
                // تم حذف الأسماء من هنا
                await conn.reply(m.chat, `⛔⃝⚡ *انـتـهـت مـحـاولاتـك!*\n✅ *الـإجـابـة الـصـحـيـحـة:* ${obito.correctAnswer}`, m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
    } else {
        try {
            conn.obito = conn.obito || {};
            let id = m.chat;

            if (conn.obito[id]) {
                await m.react('⏳⃝⚡');
                return conn.reply(m.chat, `⏳⃝⚡ *لـديـك لـعـبـة قـيـد الـتـشـغـيـل بـالـفـعـل!*`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/ze819/game/master/src/game.js/luffy1.json');
            const obitoData = await response.json();
            const obitoItem = obitoData[Math.floor(Math.random() * obitoData.length)];
            const { img, name } = obitoItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = obitoData[Math.floor(Math.random() * obitoData.length)].name;
                if (!options.includes(randomItem)) options.push(randomItem);
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    // هنا يظهر اسم البوت (المرة الوحيدة)
                    text: `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n🚩⃝⚡ *لـعـبـة "اعـرف عـلـم الـدولـة"*\n\n⏰⃝⚡ *الـوقـت:* 60 ثانـيـة\n💰⃝⚡ *الـجـائـزة:* 500xp\n\n✅ *اخـتـر الـإجـابـة الـصـحـيـحـة مـن الـأسـفـل*\n\n ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim(),
                },
                footer: { 
                    // هنا يظهر اسمك (المرة الوحيدة)
                    text: `© ʙʏ ʀɪʏᴀᴅ` 
                },
                header: {
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `${index + 1}⃝⚡ 『${option}』`,
                            id: `.اجاب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            await m.react('⚡');
            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.obito[id] = {
                correctAnswer: name,
                options,
                attempts: 2,
                timer: setTimeout(async () => {
                    if (conn.obito[id]) {
                        // رسالة انتهاء الوقت (بدون تكرار الأسماء)
                        await conn.reply(m.chat, `⏰⃝⚡ *انـتـهـى الـوقـت الـمـحـدد!*\n✅ *الـإجـابـة الـصـحـيـحـة:* ${name}`, m);
                        delete conn.obito[id];
                    }
                }, timeout)
            };

        } catch (e) {
            console.error(e);
            await m.react('❌⃝❄');
        }
    }
};

handler.help = ['علم ⃝⚡'];
handler.tags = ['game ⃝🌙'];
handler.command = /^(علم|اعلام|اجاب_\d+)$/i;

export default handler;
