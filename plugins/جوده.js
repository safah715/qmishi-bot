/*
تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁
*/

import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  // التحقق من نوع الملف 🛠️⃝⚡
  if (!/image\/(jpe?g|png)/i.test(mime)) {
    return m.reply(
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚠️⃝⚡ *تـنـبـيـه الـنـظـام:*

> يـرجـى الـرد عـلـى صـورة (JPG/PNG) لـتـنـفـيذ الـأمـر.
> مـثـال: ${usedPrefix + command}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`
    )
  }

  try {
    // ⏳⃝⚡ بـدء الـمـعـالـجـة
    await m.react('⏳⃝⚡')

    const media = await quoted.download()
    const form = new FormData()
    form.append('image', media, { filename: `upscale_${Date.now()}.png`, contentType: mime })
    form.append('scale', '2')

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'accept': 'application/json',
        'x-client-version': 'web'
      },
      body: form
    })

    const json = await res.json()

    if (!json?.result_url) throw 'F_SERVER_ERROR'

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    const caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

 ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙

✅ *تـم تـحـسـيـن الـصـورة بـنـجـاح:*

📈⃝⚡ *الـحـالـة:* دقـة عـالـيـة HD
🖼️⃝⚡ *الـتـفـاصـيـل:* تـمـت تـرقـيـة الـوضـوح

© ʙʏ ʀɪʏᴀᴅ

⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    await conn.sendMessage(m.chat, { image: resultBuffer, caption }, { quoted: m })
    await m.react('✅')

  } catch (err) {
    await m.react('❌⃝❄')
    m.reply(`❌⃝⚡ *فـشـل تـحـسـيـن الـجـودة:* ${err.message || err}`)
  }
}

handler.help = ['hd ⃝⚡']
handler.tags = ['tools ⃝🌙']
handler.command = ['اتش_دي', 'hd', 'تحسين', 'جودة']

export default handler
