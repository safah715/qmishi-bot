const { generateWAMessageFromContent, proto } = await import("@whiskeysockets/baileys");

let handler = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  try {
    await m.react('🕒')
    
    const groupCode = await conn.groupInviteCode(m.chat)
    const inviteLink = `https://chat.whatsapp.com/${groupCode}`
    
    // رسالة مع زر تفاعلي للنسخ
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "> ⓘ `رابط المجموعة`\n\n> *انسخ رابط المجموعة من هنا ⬇️*"
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ 
              text: "انقر على الزر للنسخ" 
            }),
            header: proto.Message.InteractiveMessage.Header.create({ 
              hasMediaAttachment: false 
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📋 نسخ الرابط",
                    copy_code: `${inviteLink}`
                  })
                }
              ]
            })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
    
    await m.react('✅')

  } catch (error) {
    await m.react('❌')
  }
}

handler.help = ['رابط']
handler.tags = ['مجموعة']
handler.command = ['جروب_لينك', 'لينك', 'روم_لينك', 'رابط-المجموعة', 'link']
handler.group = true
handler.botAdmin = true

export default handler