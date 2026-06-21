/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, command }) => {
    // ** الدوال المساعدة **
    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
    
    function msToTime(duration) {
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let seconds = Math.floor((duration / 1000) % 60);
        return `${minutes} دقيقة و ${seconds} ثانية`;
    }

    const PalestineAchievements = [
        'أنت محارب شجاع لقد قتلت 10 من الجنود الصهاينة',
        'أنت بطل فلسطيني تاريخي لقد أنقذت 100 فلسطيني من الموت',
        'أنت تدير شركة للطعام الصحي، وتحول الطعام إلى أهل غزة',
        'أنت جاسوس على الصهاينة، استمر في التجسس من أجل غزة',
        'أنت تعمل كجندي في حرب غزة، وتواجه التحديات بشجاعتك',
        'أنت محقق خوارق، تكتشف الأسرار التي يخفيها الصهاينة',
        'أنت تقوم بتدريب أهل غزة لمقاومة الجنود الإسرائيليين',
        'ستصبح أفضل حداد في غزة، تصنع الأسلحة القوية للمقاومة',
        'أنت طبيب رائع في غزة تعالج المصابين دون خوف',
        'أنت مزارع شجاع في غزة لأنك تطعم أهلها الصامدين',
        'أنت الآن مجند في كتائب القسام للدافع عن أرضك',
        'أنت تقوم بتطوير الأسلحة لكتائب القسام بشجاعة فائقة',
        'أنت فنان أسطوري تبهر أهل غزة لتخفف عنهم آلامهم',
        'أنت شجاع لأنك حميت طفلاً فلسطينياً من الغارات',
        'أنت تدير مستشفى ميداني في غزة بكل بسالة',
        'أنت جاسوس دولي، تتسلل لجمع معلومات حساسة لصالح المقاومة',
        'أنت عالم قوي، تبتكر اختراعات دفاعية لكتائب القسام',
        'أنت تدافع عن الشعب الفلسطيني وتقود العمليات الميدانية بشجاعة',
        'أنت محترف في فن التخفي وتنفيذ المهام السرية خلف خطوط العدو',
        'أنت طاهٍ مشهور، تُعد أطباقاً تُسعد العائلات النازحة في غزة'
    ];

    // تأمين البيانات
    let user = global.db.data.users[m.sender];
    if (!user) global.db.data.users[m.sender] = {};
    if (!user.lastPalestine) user.lastPalestine = 0;
    if (!user.doller) user.doller = 0;

    const cooldown = 600000; // 10 دقائق
    const time = user.lastPalestine + cooldown;
    
    // فحص وقت الانتظار ⏳⃝⚡
    if (Date.now() < time) {
        const remainingTime = msToTime(time - Date.now());
        return conn.reply(m.chat, 
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⏳⃝⚡ *انـتـظـر أيـهـا الـمـحـارب!*

> الـعـودة لـلـمـيـدان بـعـد:
> ${remainingTime}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`, m);
    }
    
    const reward = Math.floor(Math.random() * 5000) + 1000;
    const achievement = pickRandom(PalestineAchievements);
    
    user.doller += reward;
    user.lastPalestine = Date.now();
    
    // إرسال الرسالة بالأزرار التفاعلية ✅
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n🇵🇸⃝⚡ *إنجـازاتـك فـي مـعـركـة غـزة:*\n\n🏹 ${achievement}\n\n*🎖️ الـمـكـافـأة:* ${reward} دولار\n*💰 الـرصـيـد الـإجـمـالـي:* ${user.doller} دولار\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬` 
                    },
                    footer: { text: `© ʙʏ ʀɪʏᴀᴅ` },
                    header: { hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🛡️ الـعـودة لـلـحـرب",
                                    id: `${usedPrefix + command}`
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "💰 فـحـص الـرصـيـد",
                                    id: `${usedPrefix}bal`
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: conn.user.jid, quoted: m });

    await m.react('✅');
    return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['غزة ⃝⚡', 'فلسطين ⃝🌙'];
handler.tags = ['economy ⃝⚡'];
handler.command = /^(غزة|حرب|العدوان|فلسطين)$/i;

export default handler;
