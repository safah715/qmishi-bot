/*
تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁
*/

import axios from 'axios'
import pkg from '@whiskeysockets/baileys'
const { proto, generateWAMessageFromContent, generateWAMessageContent } = pkg

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة الـاسـتـخـدام:*

> ${usedPrefix + command} <كلمة بحث | رابط>
> مـثـال:
> ${usedPrefix + command} انمي

⌬──══─┈•⤣⚡⤤•┈─══──⌬`,
        m
      )
    }

    await m.react('⏳⃝⚡')

    const isUrl = /tiktok\.com/i.test(text)

    if (isUrl) {
      const res = await axios.get(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`
      )
      const data = res.data?.data
      if (!data?.play) throw `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n⚠️⃝⚡ *الـفـيـديـو غـيـر مـتـوفـر*\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`

      await conn.sendMessage(
        m.chat,
        {
          video: { url: data.play },
          caption: `📝⃝⚡ *الـعـنـوان:* ${data.title || 'بدون عنوان'}\n` +
                   `👤⃝⚡ *الـنـاشـر:* ${data.author?.nickname || 'غير معروف'}\n\n` +
                   `© ʙʏ ʀɪʏᴀᴅ`
        },
        { quoted: m }
      )
      await m.react('✅')
      return
    }

    const res = await axios.post(
      'https://tikwm.com/api/feed/search',
      { keywords: text, count: 5, cursor: 0, HD: 1 },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const videos = res.data?.data?.videos?.filter(v => v.play)
    if (!videos || videos.length === 0) {
      return conn.reply(m.chat, `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n❌⃝❄ لـا تـوجـد نـتـائـج لـ "${text}"\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`, m)
    }

    const cards = await Promise.all(
      videos.slice(0, 5).map(async v => {
        const videoMsg = await generateVideo(conn, v.play)
        return {
          body: { text: v.title || 'بدون عنوان' },
          footer: { text: '🎵 TikTok Search' },
          header: { hasMediaAttachment: true, videoMessage: videoMsg },
          nativeFlowMessage: {
            buttons: [{
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({ display_text: '🔗⃝⚡ فـتـح الـفـيـديـو', url: v.play })
            }]
          }
        }
      })
    )

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: ` ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n🎬⃝⚡ نـتـائـج الـبـحـث عـن: *${text}*` },
              footer: { text: `© ʙʏ ʀɪʏᴀᴅ` }, // تم حذف الإطار من هنا
              carouselMessage: { cards }
            }
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')

  } catch (e) {
    await m.react('❌⃝❄')
    conn.reply(m.chat, `${e}`, m)
  }
}

async function generateVideo(conn, url) {
  const { videoMessage } = await generateWAMessageContent({ video: { url } }, { upload: conn.waUploadToServer })
  return videoMessage
}

handler.command = /^(تيكتوك|تيك|tt|تيك-صوت|tta)$/i
export default handler
