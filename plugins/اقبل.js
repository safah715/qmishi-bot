import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

let handler = async (m, { conn, text, command }) => {
    const groupId = m.chat
    
    // 1. التحقق من وجود طلبات معلقة
    let pending = await conn.groupRequestParticipantsList(groupId)

    // إذا كان هناك أمر تنفيذ (بعد الضغط على الزر)
    if (text === 'all' || text === 'one' || text === 'reject') {
        if (!pending || pending.length === 0) return m.reply("«━━─⊱⚠️⊰─━━»\n❏ *لا تـوجـد طـلبـات لـمـعـالـجـتـهـا الآن.*")
        
        await m.react('⚡')
        let type = text === 'all' ? 'قـبـول الـكـل' : text === 'one' ? 'قـبـول أول طـلـب' : 'رفـض الـكـل'
        await m.reply(`«━━─⊱⚡⃟ٍُِ🌸⊰─━━»\n❏ *جـاري تـنـفـيذ عـملـيـة: [ ${type} ] ...*`)

        if (text === 'all') {
            for (let p of pending) {
                await conn.groupRequestParticipantsUpdate(groupId, [p.jid], "approve")
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        } else if (text === 'one') {
            await conn.groupRequestParticipantsUpdate(groupId, [pending[0].jid], "approve")
        } else if (text === 'reject') {
            for (let p of pending) {
                await conn.groupRequestParticipantsUpdate(groupId, [p.jid], "reject")
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        
        return m.reply(`«━━─⊱⚡⃟ٍُِ🌸⊰─━━»\n❏ *تـم تـنـفـيـذ الـمـهـمـة بـنـجـاح يـا escanor!* ✨`)
    }

    // 2. إذا تم طلب الأمر لأول مرة (عرض قائمة التحكم)
    if (!pending || pending.length === 0) {
        return m.reply("«━━─⊱⚡⃟ٍُِ🌸⊰─━━»\n❏ *الـسـجـل نـظـيـف، لا تـوجـد طـلبـات دخـول مـعـلـقـة.* 🎀")
    }

    await m.react('🎀')
    const imgUrl = "https://files.catbox.moe/9snqb9.jpg"
    const media = await prepareWAMessageMedia({ image: { url: imgUrl } }, { upload: conn.waUploadToServer })

    let bodyText = `«━━─⊱⚡⃟ٍُِ🌸⊰─━━»
  *إدارة طـلـبـات الـدخـول* ✨
«━━─⊱⚡⃟ٍُِ🌸⊰─━━»

❏ *عـدد الـطـلـبـات:* [ ${pending.length} ] طـلـب مـعـلـق 🎀
❏ *الـمـطـور:* escanor ✨

«━━─⊱✨⃟ٍُِ🌺⊰─━━»
  *اخـتـر الإجـراء الـمـطـلـوب* 👇
«━━─⊱✨⃟ٍُِ🌺⊰─━━»`

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: "𝐨𝐮𝐜𝐡𝐢 𝐛𝐨𝐭 𝐯2⏤͟͟͞🍓 ╎ 𝙱𝚈 𝙴𝚂𝙲𝙰𝙽𝙾𝚁" }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "🛡️ نـظـام الـرادع الـمـلـكـي",
                        hasMediaAttachment: true,
                        ...(media.imageMessage ? { imageMessage: media.imageMessage } : {})
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({ display_text: "✅ قـبـول الـكـل", id: `.اقبلهم all` })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({ display_text: "👤 قـبـول أول طـلب", id: `.اقبلهم one` })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({ display_text: "❌ رفـض الـجـمـيـع", id: `.اقبلهم reject` })
                            }
                        ]
                    })
                })
            }
        }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['اقبلهم']
handler.tags = ['group']
handler.command = /^(اقبلهم|الطلبات|قبول)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler