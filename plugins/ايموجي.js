import fs from 'fs'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'

const timeout = 60000
const poin = 2000

let handler = async (m, { conn, command, usedPrefix }) => {
  let name = conn.getName(m.sender)
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { exp: 0, level: 0, registered: false }
  }

  let user = global.db.data.users[m.sender]
  conn.tekateki = conn.tekateki || {}
  let id = m.chat

  // ────── التعامل مع الإجابات ──────
  if (command.startsWith('check_')) {
    let Ruby = conn.tekateki[id]
    if (!Ruby) return
    
    let selectedAnswer = command.replace('check_', '').replace(/_/g, ' ')
    let correctAnswer = Ruby[1].response

    if (selectedAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      user.exp += Ruby[2]
      await m.react('✅')
      await conn.reply(m.chat, `✅ *إجـابـة صـحـيـحـة يـا بـطـل!*\n\n> *🎉 ربـحـت:* ${Ruby[2]} XP`, m)
      clearTimeout(Ruby[3]); delete conn.tekateki[id]
    } else {
      await m.react('❌⃝❄')
      await conn.reply(m.chat, `❌⃝❄ *إجـابـة خـاطـئـة.. حـاول مـرة أخـرى!*`, m)
    }
    return
  }

  try {
    if (id in conn.tekateki) return conn.reply(m.chat, `⏳⃝⚡ *أكـمـل الاخـتـبـار الـقـائـم أولاً..*`, conn.tekateki[id][0])

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/miku4.json`))
    let json = tekateki[Math.floor(Math.random() * tekateki.length)]
    
    let options = [json.response]
    while (options.length < 4) {
      let randomRes = tekateki[Math.floor(Math.random() * tekateki.length)].response
      if (!options.includes(randomRes)) options.push(randomRes)
    }
    options.sort(() => Math.random() - 0.5)

    const media = await prepareWAMessageMedia(
      { image: { url: 'https://files.catbox.moe/mshkf2.jpg' } }, 
      { upload: conn.waUploadToServer }
    )

    const interactiveMessage = {
      body: {
        text: `*╭━━ 🎮 سـؤال الإيـمـوجـي ━━⃝⚡*\n\n` +
              `*⃝⚡ أهـلاً بـك:* ${name}\n` +
              `*⃝⚡ الـجـائـزة:* ${poin} XP\n` +
              `*⃝⚡ الـوقـت:* ${(timeout / 1000).toFixed(0)} ثـانـيـة\n\n` +
              `*╭━━ ❐ الـمـطـلـوب ━━⃝⚡*\n` +
              `*⃝🫐* ${json.question}\n\n` +
              `*⚡ اخـتـر الإجـابـة الـصـحـيـحـة أدناه*`.trim(),
      },
      footer: { 
        text: ' ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 '
      },
      header: {
        hasMediaAttachment: true,
        imageMessage: media.imageMessage,
      },
      nativeFlowMessage: {
        buttons: options.map((option, index) => ({
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: `${index % 2 === 0 ? '⃝⚡' : '⃝🌙'} ${option}`,
            id: `${usedPrefix}check_${option.replace(/\s/g, '_')}`,
          }),
        })),
      },
    }

    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('📅⃝⚡')

    conn.tekateki[id] = [msg, json, poin, setTimeout(() => {
        if (conn.tekateki[id]) {
          conn.reply(m.chat, `⏳⃝⚡ *انـتـهـى الـوقـت!*\n\n🎯 *الإجـابـة الـصـحـيـحـة كـانـت:* ${json.response}`, conn.tekateki[id][0])
          delete conn.tekateki[id]
        }
      }, timeout)]
  } catch (e) { console.error(e) }
}

handler.help = ['ايموجي ⃝⚡']
handler.tags = ['game ⃝🌙']
handler.command = /^(ايموجي|check_.+)$/i

export default handler
