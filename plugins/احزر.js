import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    conn.obito = conn.obito || {};
    let id = m.chat;

    if (command.startsWith('جوابي_')) {
        let obito = conn.obito[id];

        if (!obito) {
            return conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆لا توجد لعبة نشطة الان*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆اختيار غير صالح*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
        }

        let selectedAnswer = obito.options[selectedAnswerIndex - 1];
        let isCorrect = obito.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆✅ إجابة صحيحة مبروك*\n*⃝🌙┆🏆 الجائزة: 500xp*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(obito.timer);
            delete conn.obito[id];
        } else {
            obito.attempts -= 1;
            if (obito.attempts > 0) {
                await conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆❌ إجابة خاطئة*\n*⃝🌙┆🔄 المحاولات المتبقية: ${obito.attempts}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
            } else {
                await conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆❌ إجابة خاطئة*\n*⃝🌙┆⏰ انتهت محاولاتك*\n*⃝⚡┆📌 الإجابة الصحيحة: ${obito.correctAnswer}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
                clearTimeout(obito.timer);
                delete conn.obito[id];
            }
        }
    } else {
        try {
            if (conn.obito[id]) {
                return conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆يوجد لعبة سابقة لم تنتهي*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
            }

            const response = await fetch('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
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
                    text: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆🎮 لعبة تعرف على شخصية الأنمي*\n*⃝🌙┆⏱️ الوقت: 60 ثانية*\n*⃝⚡┆🏆 الجائزة: 500xp*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`,
                },
                footer: { text: '𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n© ʙʏ ʀɪʏᴀᴅ' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'اختر اسم الشخصية من الخيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `${index % 2 === 0 ? '⃝⚡' : '⃝🌙'}『${option}』`,
                            id: `.جوابي_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: { message: { interactiveMessage } },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.obito[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.obito[id]) {
                        await conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆⏰ انتهى الوقت*\n*⃝🌙┆📌 الإجابة الصحيحة: ${name}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
                        delete conn.obito[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆⚠️ حدث خطأ*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m);
        }
    }
};

handler.help = ['احزر'];
handler.tags = ['لعبة'];
handler.command = /^(احزر|احذر|جوابي_\d+)$/i;

export default handler;
