/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

import fs from 'fs'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

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

  // ────── 🌙 الـتـعـامـل مـع الإجـابـات ──────
  if (command.startsWith('check_')) {
    let Ruby = conn.tekateki[id]
    if (!Ruby) return
    
    let selectedAnswer = command.replace('check_', '').replace(/_/g, ' ')
    let correctAnswer = Ruby[1].response

    if (selectedAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      user.exp += Ruby[2]
      await conn.reply(m.chat, `✅⃝🌙 *إجــابــة صــحــيــحــة!*\n\n> *🎉 ربــحــت:* ${Ruby[2]} XP`, m)
      clearTimeout(Ruby[3]); delete conn.tekateki[id]
    } else {
      await conn.reply(m.chat, `❌⃝⚡ *إجــابــة خــاطــئــة!*`, m)
    }
    return
  }

  try {
    if (id in conn.tekateki) return conn.reply(m.chat, `⌛⃝⚡ *أكـمـل الـسـؤال الـقـائـم أولاً..*`, conn.tekateki[id][0])

    let tekateki = JSON.parse(fs.readFileSync(`./src/game/تاريخ.json`))
    let json = tekateki[Math.floor(Math.random() * tekateki.length)]
    
    let options = [json.response]
    while (options.length < 4) {
      let randomRes = tekateki[Math.floor(Math.random() * tekateki.length)].response
      if (!options.includes(randomRes)) options.push(randomRes)
    }
    options.sort(() => Math.random() - 0.5)

    const interactiveMessage = {
      body: {
        text: `
꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷
   *ᯓ⍣⃝🌙 سـؤال الـتـاريـخ 🌙 ࣪𓂃*
꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷

*⃝⚡ أهـلاً بـك يـا:* ${name}
*⃝⚡ الـجـائـزة:* ${poin} XP
*⃝⚡ الـوقـت:* ${(timeout / 1000).toFixed(0)} ثانية

꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷
       *⃝🫐 الـمـطـلـوب*
꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷

*⃝🫐* ${json.question}
*⃝🫐 الـمـطـور:* ʀɪʏᴀᴅ

꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷
    *⃝❄ اخـتـر مـن الـأزرار أدناه*
꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`.trim(),
      },
      footer: { 
        text: `© ʙʏ ʀɪʏᴀᴅ` // حقوق المطور في الفوتر [cite: 2026-02-09]
      },
      nativeFlowMessage: {
        buttons: options.map((option, index) => ({
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: `${index % 2 === 0 ? '⃝⚡' : '⃝🌙'} ${option}`, // زخرفة الأزرار [cite: 2026-02-08]
            id: `${usedPrefix}check_${option.replace(/\s/g, '_')}`,
          }),
        })),
      },
    }

    const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    conn.tekateki[id] = [msg, json, poin, setTimeout(() => {
        if (conn.tekateki[id]) {
          conn.reply(m.chat, `⌛⃝🌙 *انــتــهــى الــوقــت*\n🎯 *الإجــابــة الـصـحـيـحـة:* ${json.response}`, conn.tekateki[id][0])
          delete conn.tekateki[id]
        }
      }, timeout)]
  } catch (e) { console.error(e) }
}

handler.help = ['تاريخ']
handler.tags = ['game']
handler.command = /^(تاريخ|check_.+)$/i

export default handler
