/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import yts from 'yt-search'
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await m.react('⚡')
    return conn.sendMessage(m.chat, { 
      text: `⚠️⃝⚡ *يـرجـى إدخـال اسـم الـفـيـديـو أو الـرابـط.*\n*مـثـال:* ${usedPrefix + command} stay` 
    }, { quoted: m })
  }

  try {
    await m.react('⏳⃝⚡')
    let search = await yts(text)
    if (!search || !search.videos || !search.videos.length) {
      await m.react('❌⃝❄')
      return conn.sendMessage(m.chat, { text: "⚠️⃝⚡ لـم أجد أي نـتـائـج لـهذا الـبـحث." }, { quoted: m })
    }

    let video = search.videos[0]
    let url = video.url

    let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🎬 *الـعـنـوان:* ${video.title}
📺 *الـقـنـاة:* ${video.author.name}
⏱️ *الـمـدة:* ${video.timestamp}
📅 *الـنـشـر:* ${video.ago}
🔗 *الـرابـط:* ${url}

✅ *اخـتـر نـوع الـتـحـمـيـل مـن الـقـائـمـة أدناه.*

⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    // ✅ إعـدادات الـقـائـمـة الـتـفـاعـلـيـة
    let sections = [
      {
        title: "⭐ خـيـارات الـتـحـمـيـل",
        rows: [
          {
            header: "🎵 تـحـمـيـل صـوتـي",
            title: "فـي مـلـف MP3",
            description: "تـحـمـيـل الـأغـنـيـة بـأعـلـى جـودة صـوتـيـة",
            id: `.اغنيه ${url}`
          },
          {
            header: "📹 تـحـمـيـل مـرئـي",
            title: "فـي مـلـف MP4",
            description: "تـحـمـيـل الـفـيـديـو بـجـودة مـنـاسـبـة",
            id: `.فيديو ${url}`
          }
        ]
      }
    ]

    let listMessage = {
      title: "📂 عـرض الـخـيـارات",
      sections,
      buttonText: "اخـتـر الـتـنـسـيـق"
    }

    let imgMsg = await prepareWAMessageMedia({ image: { url: video.thumbnail } }, { upload: conn.waUploadToServer })

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡" }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: true,
                imageMessage: imgMsg.imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify(listMessage)
                  }
                ]
              })
            })
          }
        }
      },
      { userJid: m.sender, quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌⃝❄')
    conn.sendMessage(m.chat, { text: "⚠️⃝⚡ حـصـل خـطـأ أثـنـاء مـعـالـجـة الـطـلـب." }, { quoted: m })
  }
}

handler.help = ['شغل ⃝⚡']
handler.tags = ['downloader ⃝🌙']
handler.command = /^(شغل|play)$/i

export default handler
