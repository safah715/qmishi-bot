/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

import { randomInt } from 'crypto'

let Reg = /\|?(.*?)(?:[.|] *?(\d+))?$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
    try {
        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/t0hl4l.jpg')
        let user = global.db.data.users[m.sender]
        
        if (user.registered) return m.reply(`✅ *أنـت مـسـجـل بـالـفـعـل فـي الـنـظـام*`)

        let jid = m.sender
        let name = text?.trim() || await conn.getName(jid) || ''
        let match = name.match(Reg)
        name = (match && match[1].trim()) || name
        if (/^\+?\d+$/.test(name)) name = ''
        let age = match[2] ? parseInt(match[2]) : null

        if (!age) {
            let lists = Array.from({ length: 41 }, (_, i) => {
                let usia = i + 10
                return {
                    title: `العمر ${usia} سنة`,
                    description: `⏳⃝⚡ اضغط لاختيار العمر ${usia}`,
                    id: `${usedPrefix + command} ${name}.${usia}`
                }
            })
            await conn.sendMessage(m.chat, {
                image: { url: pp },
                caption: `⚡ *الـرجـاء اخـتـيـار عـمـرك مـن الـقـائـمـة بـالـأسـفـل*\n` +
                          `⏰⃝⚡ *تـأكـد مـن اخـتـيـار الـعـمـر الـصـحـيـح لـإتـمـام الـتـسـجـيـل*`.trim(),
                interactiveButtons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: '📅⃝⚡ قـائـمـة الـأعـمـار',
                            sections: [
                                { title: '⭐ اختر عمرك', rows: lists }
                            ]
                        })
                    }
                ],
                hasMediaAttachment: false
            }, { quoted: m })
            return
        }

        if (!name) return m.reply('⚡ *لـا يـمـكـن أن يـكـون الـاسـم فـارغـاً*')
        if (age > 50) return m.reply('🧓⃝⚡ *هـذا الـعـمـر كـبـيـر جـداً لـلـتـسـجـيـل*')
        if (age < 10) return m.reply('👶⃝⚡ *أنت صغير جداً على استخدام هذه الخدمات*')

        await m.reply('⏳⃝⚡ *جـاري مـعـالـجـة بـيـانـاتـك...*')

        user.name = name.trim()
        user.age = age
        user.regTime = + new Date
        user.registered = true
        user.pin = randomInt(100000, 999999)

        // النتيجة النهائية: هنا فقط يظهر اسم البوت واسمك في الفوتر
        let capUser = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                      `👤⃝⚡ *الـاسـم:* ${user.name}\n` +
                      `📅⃝⚡ *الـعـمـر:* ${user.age} سنة\n` +
                      `🔐⃝⚡ *الـكـود (PIN):* ${user.pin}\n\n` +
                      `✅ *تـم تـسـجـيـلـك بـنـجـاح فـي الـنـظـام*\n` +
                      `🛠️⃝⚡ *احـتـفـظ بـالـكـود لـعـمـلـيـات الـتـحـقـق*\n\n` +
                      `© ʙʏ ʀɪʏᴀᴅ`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: capUser,
            footer: '© ʙʏ ʀɪʏᴀᴅ',
            interactiveButtons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '⃝⚡ الـقـائـمـة',
                        id: '.اوامر'
                    })
                }
            ],
            hasMediaAttachment: false
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply(`⚠️⃝⚡ *حـدث خـطأ أثـنـاء الـتـسـجـيـل*`)
    }
}

handler.help = ['تسجيل', 'register', 'reg']
handler.tags = ['xp']
handler.command = /^(تسجيل|verify|reg(ister)?)$/i

export default handler
