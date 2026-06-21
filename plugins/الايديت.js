import axios from 'axios'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, usedPrefix, command }) => {

  // تحديد كلمة البحث حسب الأمر
  let searchKeyword = ''
  if (command === 'ايديت_كوره') searchKeyword = 'ايديت كرة قدم'
  if (command === 'ايديت_انمي') searchKeyword = 'ايديت انمي'
  if (command === 'ايديت_سيارات') searchKeyword = 'ايديت سيارات'

  if (!searchKeyword) return

  const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text)

  try {
    await m.react('🕒')

    if (isUrl) {
      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`)
      const data = res.data?.data
      if (!data?.play && !data?.music) return

      const { title, play, music } = data

      if (command === 'تيك_صوت') {
        if (!music) return
        await conn.sendMessage(
          m.chat,
          { 
            audio: { url: music }, 
            mimetype: 'audio/mpeg', 
            fileName: 'nino_audio.mp3' 
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          { 
            video: { url: play }, 
            caption: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆🎬 تـم تـحـمـيـل الايديت بـنـجـاح*\n*⃝🌙┆📌 الـعنوان: ${title || 'بدون عنوان'}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n\n ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙` 
          },
          { quoted: m }
        )
      }

    } else {
      const res = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: { keywords: searchKeyword, count: 5, cursor: 0, HD: 1 }
      })

      const results = res.data?.data?.videos?.filter(v => v.play) || []
      if (!results.length) return m.reply('*⃝⚡┆❌ لـم يـتـم الـعـثـور عـلـى نـتـائـج*')

      const cards = []
      for (let video of results) {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: ` ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: video.title || 'NINO EDIT',
            hasMediaAttachment: true,
            videoMessage: (await generateWAMessageContent(
              { video: { url: video.play } },
              { upload: conn.waUploadToServer }
            )).videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              { type: 1, displayText: '⃝⚡ تحميل الفيديو', buttonId: `!تيك_توك ${video.play}` },
              { type: 1, displayText: '⃝🌙 تحميل الصوت', buttonId: `!تيك_صوت ${video.play}` }
            ]
          })
        })
      }

      const responseMessage = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ 
                text: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆🎬 اقـتـراحـات ايديت ${searchKeyword}*\n*⃝🌙┆تـصـفـح الـقـائمة لـلـمشاهدة*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*` 
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: '🔎 NINO EDIT SYSTEM' }),
              header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
            })
          }
        }
      }, { quoted: m })

      await conn.relayMessage(m.chat, responseMessage.message, { messageId: responseMessage.key.id })
    }

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
  }
}

handler.help = ['ايديت', 'ايديت_كوره', 'ايديت_انمي', 'ايديت_سيارات']
handler.tags = ['downloader']
handler.command = ['ايديت_كوره', 'ايديت_انمي', 'ايديت_سيارات']
handler.group = true

export default handler
