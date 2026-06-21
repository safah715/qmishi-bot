/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import fetch from 'node-fetch'
import { addExif } from '../lib/sticker.js'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let [packname, ...author] = args.join(' ').split('|')
    author = (author || []).join('|')
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    await m.react('⏳⃝⚡')

    if (/webp/g.test(mime)) {
      // تـعـديـل حـقـوق مـلـصـق مـوجـود
      let img = await q.download?.()
      stiker = await addExif(img, packname || global.packname, author || global.author)
    } else if (/image/g.test(mime)) {
      // تـحـويـل صـورة إلـى مـلـصـق
      let img = await q.download?.()
      stiker = await createSticker(img, false, packname || global.packname, author || global.author)
    } else if (/video/g.test(mime)) {
      // تـحـويـل فـيـديـو أو GIF إلـى مـلـصـق مـتـحـرك
      if ((q.msg || q).seconds > 10) return m.reply('⚠️⃝⚡ الـفـيـديـو طـويـل جـداً، حـاول إرسـال مـقـطع أقـل مـن 7 ثـوانٍ.')
      let img = await q.download?.()
      stiker = await mp4ToWebp(img, { pack: packname || global.packname, author: author || global.author })
    } else if (args[0] && isUrl(args[0])) {
      // تـحـويـل مـن رابـط
      stiker = await createSticker(false, args[0], '', author, 20)
    } else {
      await m.react('⚡')
      return m.reply(
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة الـاسـتـخـدام:*
قـم بـالـرد عـلـى صـورة أو فـيـديـو بـأمـر:
*${usedPrefix + command}*

لـإضـافـة حـقـوق مـخـصـصـة:
*${usedPrefix + command} حـقـوقـي | اسـمـي*

⌬──══─┈•⤣⚡⤤•┈─══──⌬`)
    }
  } catch (e) {
    console.error(e)
    stiker = false
    await m.react('❌⃝❄')
  } finally {
    if (stiker) {
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
      await m.react('✅')
    } else {
      m.reply('⚠️⃝⚡ حـدث خـطـأ، تـأكـد مـن إرسـال وسـائـط صـالـحـة.')
    }
  }
}

handler.help = ['ملصق ⃝⚡']
handler.tags = ['sticker ⃝🌙']
handler.command = ['ستيكر', 'ملصق', 's', 'sticker']

export default handler

// --- الـدوال الـمـسـاعـدة ---
const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))

async function createSticker(img, url, packName, authorName, quality) {
  let stickerMetadata = { type: 'full', pack: packName, author: authorName, quality: 100 }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

async function mp4ToWebp(file, stickerMetadata) {
  let getBase64 = file.toString('base64')
  const Format = {
    file: `data:video/mp4;base64,${getBase64}`,
    processOptions: { crop: false, startTime: '00:00:00.0', endTime: '00:00:7.0', loop: 0 },
    stickerMetadata: { ...stickerMetadata },
    sessionInfo: { WA_VERSION: '2.2106.5' },
    config: { sessionId: 'session', headless: true }
  }

  let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Format)
  })

  if (!res.ok) throw 'فـشـل تـحـويـل الـفـيـديـو'
  return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
}
