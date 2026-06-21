/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import axios from 'axios'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'
import cheerio from 'cheerio'

const randomSearchList = [
    'خلفيات انمي 4k',
    'خلفيات كرة قدم 4k',
    'خلفيات من الكون 4k',
    'خلفيات سيارات 4k',
    'خلفيات متنوعه 4k'
]

let handler = async (m, { conn, text, args, usedPrefix, command }) => {

    if (!text) {
        text = randomSearchList[Math.floor(Math.random() * randomSearchList.length)]
    }

    try {
        await m.react('⏳⃝⚡')

        if (text.includes("https://")) {
            let i = await dl(args[0])
            let isVideo = i.download.includes(".mp4")
            await conn.sendMessage(
                m.chat,
                { [isVideo ? "video" : "image"]: { url: i.download }, caption: i.title },
                { quoted: m }
            )
        } else {
            const results = await pins(text)
            if (!results.length) {
                return await conn.reply(m.chat, `> ❌⃝❄ *لـم يـتـم الـعـثـور عـلـى نـتـائـج لـلـبـحث: "${text}"*`, m)
            }

            const pinsToShow = results.slice(0, 6)
            const cards = []

            for (let i = 0; i < pinsToShow.length; i++) {
                const pin = pinsToShow[i]
                const info = await getPinInfo(pin)

                const header = await generateWAMessageContent({
                    image: { url: pin.image_large_url }
                }, { upload: conn.waUploadToServer })

                cards.push({
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: info.title || '𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡',
                        hasMediaAttachment: true,
                        imageMessage: header.imageMessage
                    }),
                    body: proto.Message.InteractiveMessage.Body.fromObject({ 
                        text: `👤 *الـرافع:* ${info.user}\n📋 *الـلـوحة:* ${info.board}` 
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({
                        text: '© ʙʏ ʀɪʏᴀᴅ'
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🔗 فـتـح الـرابـط",
                                    url: info.link,
                                    merchant_url: info.link
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🖼️ مـزيـد مـن الـصـور",
                                    id: `${usedPrefix + command} ${text}`
                                })
                            }
                        ]
                    })
                })
            }

            const message = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({ 
                                text: `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n🖼️⃝⚡ *نـتـائـج الـبـحث عـن:* ${text}\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬` 
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: '𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡' }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
                        })
                    }
                }
            }, { quoted: m })

            await conn.relayMessage(m.chat, message.message, { messageId: message.key.id })
            await m.react('✅')
        }

    } catch (e) {
        await m.react('❌⃝❄')
        console.error(e)
    }
}

handler.help = ['خلفيات ⃝⚡']
handler.command = ['خلفيات', 'خالفيات', 'بنت']
handler.tags = ["تحميل ⃝🌙"]
handler.group = true

export default handler

// --- الـدوال الـمـسـاعـدة ---
async function getPinInfo(imageData) {
    if (imageData.pinner) {
        return {
            user: imageData.pinner.full_name || imageData.pinner.username,
            title: imageData.title || 'بـدون عـنـوان',
            board: imageData.board?.name || 'مـتـنـوع',
            link: imageData.url || `https://pinterest.com/pin/${imageData.id}/`
        }
    }
    return { user: 'N/A', title: 'N/A', board: 'N/A', link: '#' }
}

async function dl(url) {
    try {
        let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } })
        let $ = cheerio.load(res.data)
        let tag = $('script[data-test-id="video-snippet"]')
        if (tag.length) {
            let result = JSON.parse(tag.text())
            return { title: result.name, download: result.contentUrl }
        } else {
            let json = JSON.parse($("script[data-relay-response='true']").eq(0).text())
            let result = json.response.data["v3GetPinQuery"].data
            return { title: result.title, download: result.imageLargeUrl }
        }
    } catch { return { msg: "Error" } }
}

const pins = async (judul) => {
    const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(judul)}%22%2C%22scope%22%3A%22pins%22%7D%2C%22context%22%3A%7B%7D%7D`
    try {
        const res = await axios.get(link)
        return res.data.resource_response.data.results.map(item => ({
            image_large_url: item.images.orig?.url,
            pinner: item.pinner,
            title: item.title,
            board: item.board,
            id: item.id,
            url: item.url
        })).filter(img => img.image_large_url)
    } catch { return [] }
}
