import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  let done = '🖼️'
  m.react(done)

  const notStickerMessage = `❀° ┄───────╭\n\n⃠┇قم بالرد على الملصق بـ :\n\n*${usedPrefix + command}*\n\n╯───────┄ °❀`

  if (!m.quoted) throw notStickerMessage

  const q = m.quoted
  let mime = q.mediaType || ''
  if (!/sticker/.test(mime)) throw notStickerMessage

  let media = await q.download()
  let imageBuffer

  try {
    // محاولة التحويل
    imageBuffer = await webp2png(media)
  } catch (e) {
    // فشل التحويل → نرسل الصورة مباشرة
    imageBuffer = media
  }

  await conn.sendMessage(
    m.chat,
    {
      image: imageBuffer,
      caption: '🖼️╎تـفـضــل طـلـبــك˙⁠❥⁠'
    },
    { quoted: m }
  )
}

handler.help = ['toimg <sticker>']
handler.tags = ['sticker']
handler.command = ['toimg', 'jpg', 'aimg', 'لصوره', 'لصورة']

export default handler