import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {

  if (!m.isGroup) return

  let users = participants.map(u => conn.decodeJid(u.id))

  // رسالة وهمية للاقتباس
  let fakegif = {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: m.chat
    },
    message: {
      videoMessage: {
        title: '◌°`* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*',
        seconds: 99999,
        gifPlayback: true,
        caption: '`* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*'
      }
    }
  }

  // النص المرسل
  let teks = text ? text : (m.quoted ? m.quoted.text : '')

  if (!teks) {
    return conn.reply(m.chat, '✳️ اكتب النص بعد الأمر', m)
  }

  const msg = generateWAMessageFromContent(
    m.chat,
    {
      extendedTextMessage: {
        text: teks,
        contextInfo: {
          mentionedJid: users
        }
      }
    },
    {
      quoted: fakegif,
      userJid: conn.user.id
    }
  )

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notificar|مخفي)$/i
handler.group = true
handler.admin = true

export default handler