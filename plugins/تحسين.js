/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
الـمـطـور الـحـقـيـقـي: ʀɪʏᴀᴅ 🍁
*/

import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  // التحقق من أن الملف صورة JPG أو PNG
  if (!/image\/(jpe?g|png)/i.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(
      `⚡ *قـم بـإرسـال أو الـرد عـلـى صـورة لـتـحـسـيـنـهـا*\n\n📌 *الـاسـتـخـدام:* ${usedPrefix + command}`
    )
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const media = await quoted.download()
    const ext = mime.split('/')[1]
    const filename = `nino_hd_${Date.now()}.${ext}`

    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'ar'
    }

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()

    if (!json?.result_url || !json.result_url.startsWith('http')) {
      throw new Error('لـم يـتـم الـحـصـول عـلـى الـصـورة مـن الـسـيـرفـر')
    }

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    let caption = ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                  `✅ *تـم تـحـسـيـن جـودة الـصـورة بـنـجـاح*\n\n` +
                  `🛠️⃝⚡ *الـتـفـاصـيـل:* دقة أعلى وتفاصيل أوضح\n` +
                  `🖼️⃝⚡ *الـنـتـيـجـة:* صورة نقية بجودة HD\n\n` +
                  `© ʙʏ ʀɪʏᴀᴅ`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: caption
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`❌⃝⚡ *فـشـل تـحـسـيـن الـصـورة:* ${err.message || err}`)
  }
}

handler.help = ['hd']
handler.tags = ['tools', 'image']
handler.command = ['mejorar', 'hd', 'تحسين', 'جودة', 'جوده']

export default handler
