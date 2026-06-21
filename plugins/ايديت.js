import axios from 'axios'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, '> ⓘ `اكتب نوع الايديت للبحث يا صاح`', m)

  const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text)

  try {
    await m.react('🕒')

    if (isUrl) {
      // الرابط مباشر
      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`)
      const data = res.data?.data
      if (!data?.play && !data?.music) return conn.reply(m.chat, '> ⓘ `رابط غير صالح أو بدون محتوى قابل للتنزيل`', m)

      const { title, author, play, music } = data

      if (command === 'تيك_صوت' || command === 'ttaudio') {
        if (!music) return conn.reply(m.chat, '> ⓘ `لم يتم الحصول على الصوت من الفيديو`', m)

        await conn.sendMessage(
          m.chat,
          { audio: { url: music }, mimetype: 'audio/mpeg', fileName: `tiktok_audio.mp3`, ptt: false },
          { quoted: m }
        )
      } else {
        const caption = `> ⓘ \`العنوان:\` *${title || 'غير متوفر'}*\n> ⓘ \`المؤلف:\` *${author?.nickname || 'غير متوفر'}*`
        await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })
      }

    } else {
      // البحث بالنص (إرسال الأمر + النص)
      if (command === 'تيك_صوت' || command === 'ttaudio')
        return conn.reply(m.chat, '> ⓘ `لتحميل الصوت تحتاج إلى رابط تيك توك`', m)

      const res = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: { keywords: `${command} ${text}`, count: 5, cursor: 0, HD: 1 }
      })

      const results = res.data?.data?.videos?.filter(v => v.play) || []
      if (!results.length) return conn.reply(m.chat, '> ⓘ `لم يتم العثور على مقاطع فيديو`', m)

      const cards = []
      for (let video of results) {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: '🪽 ايديت\n𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫ 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧* 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: video.title || 'بدون عنوان',
            hasMediaAttachment: true,
            videoMessage: (await generateWAMessageContent(
              { video: { url: video.play } },
              { upload: conn.waUploadToServer }
            )).videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              { type: 1, displayText: '▶️ مشاهدة الفيديو', buttonId: `!تيك_توك ${video.play}` },
              { type: 1, displayText: '🎵 تحميل الصوت', buttonId: `!تيك_صوت ${video.play}` }
            ]
          })
        })
      }

      const responseMessage = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: null }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: '🔎 ايديت' }),
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
    await m.react('❌')
    await conn.reply(m.chat, `> ⓘ \`خطأ:\` *${e.message}*`, m)
  }
}

handler.help = ['تيك_توك', 'تيك_صوت']
handler.tags = ['downloader']
handler.command = ['ايديت']
handler.group = true

export default handler