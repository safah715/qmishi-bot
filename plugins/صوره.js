import axios from 'axios'
import baileys from '@whiskeysockets/baileys'
import cheerio from 'cheerio'

let handler = async (m, { conn, text, args, usedPrefix }) => {
    // التحقق من وجود نص البحث
    if (!text) {
        await m.react('⚡')
        return conn.reply(m.chat, '⚡ *بـحـث غـيـر مـكـتـمـل*\n\n✅ الـرجـاء إدخـال مـا تـريـد الـبـحـث عـنـه.', m)
    }

    try {
        await m.react('⏳⃝⚡') // تفاعل مؤقت

        // إذا كان النص يحتوي على رابط (تحميل مباشر)
        if (text.includes("https://")) {
            let i = await dl(args[0])
            let isVideo = i.download.includes(".mp4")
            await conn.sendMessage(m.chat, { [isVideo ? "video" : "image"]: { url: i.download }, caption: i.title }, { quoted: m })
            await m.react('✅')
        } else {
            // البحث عن صور
            const results = await pins(text)
            if (!results.length) {
                await m.react('❌⃝❄')
                return conn.reply(m.chat, `❌⃝❄ *لا تـوجـد نـتـائـج*\n\n⚡ لـم يـتـم الـعـثـور عـلـى نـتـائـج لـ "${text}".`, m)
            }

            // اختيار صورة عشوائية
            const randomIndex = Math.floor(Math.random() * results.length)
            const selectedImage = results[randomIndex]

            // الحصول على معلومات الصورة المختارة
            const pinInfo = await getPinInfo(selectedImage)

            const captionImage = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🖼️⃝⚡ *صـورة مـن Pinterest*

⚡ *الـمـوضـوع:* ${text}
📝⃝⚡ *الـعـنـوان:* ${pinInfo.title || 'لا يوجد عنوان'}
👤⃝⚡ *الـمـسـتـخـدم:* ${pinInfo.user || 'غير متوفر'}
📌⃝⚡ *الـلـوح:* ${pinInfo.board || 'غير متوفر'}

✅ *تـمـت عـمـلـيـة الـبـحـث بـنـجـاح*

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim()

            // إرسال الصورة مع المعلومات
            await conn.sendMessage(m.chat, { 
                image: { url: selectedImage.image_large_url }, 
                caption: captionImage
            }, { quoted: m })

            await m.react('✅') // تفاعل نجاح
        }
    } catch (e) {
        console.error(e)
        await m.react('❌⃝❄')
        await conn.reply(m.chat, '❌⃝❄ *حـدث خـطـأ أثـنـاء الـبـحـث*', m)
    }
}

handler.help = ['صور ⃝⚡', 'صوره ⃝⚡']
handler.command = ['صور', 'صوره']
handler.tags = ["تحميل ⃝🌙"]
handler.group = true

export default handler

async function getPinInfo(imageData) {
    try {
        if (imageData.pinner) {
            return {
                user: `${imageData.pinner.full_name || imageData.pinner.username}`,
                title: `${imageData.title || imageData.grid_title || 'لا يوجد عنوان'}`,
                board: `${imageData.board?.name || 'لوح غير متوفر'}`,
                link: imageData.url || `https://pinterest.com/pin/${imageData.id}/`
            }
        }
        return { user: 'غير متوفر', title: 'لا يوجد عنوان', board: 'لوح غير متوفر', link: '#' }
    } catch (error) {
        return { user: 'غير متوفر', title: 'لا يوجد عنوان', board: 'لوح غير متوفر', link: '#' }
    }
}

async function dl(url) {
    try {
        let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(e => e.response)
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
    } catch {
        return { msg: "خطأ" }
    }
}

const pins = async (judul) => {
    const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22applied_unified_filters%22%3Anull%2C%22appliedProductFilters%22%3A%22---%22%2C%22article%22%3Anull%2C%22auto_correction_disabled%22%3Afalse%2C%22corpus%22%3Anull%2C%22customized_rerank_type%22%3Anull%2C%22domains%22%3Anull%2C%22dynamicPageSizeExpGroup%22%3A%22control%22%2C%22filters%22%3Anull%2C%22journey_depth%22%3Anull%2C%22page_size%22%3Anull%2C%22price_max%22%3Anull%2C%22price_min%22%3Anull%2C%22query_pin_sigs%22%3Anull%2C%22query%22%3A%22${encodeURIComponent(judul)}%22%2C%22redux_normalize_feed%22%3Atrue%2C%22request_params%22%3Anull%2C%22rs%22%3A%22typed%22%2C%22scope%22%3A%22pins%22%2C%22selected_one_bar_modules%22%3Anull%2C%22seoDrawerEnabled%22%3Afalse%2C%22source_id%22%3Anull%2C%22source_module_id%22%3Anull%2C%22source_url%22%3A%22%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped%22%2C%22top_pin_id%22%3Anull%2C%22top_pin_ids%22%3Anull%7D%2C%22context%22%3A%7B%7D%7D`
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' }
    try {
        const res = await axios.get(link, { headers })
        if (res.data?.resource_response?.data?.results) {
            return res.data.resource_response.data.results.map(item => {
                if (item.images) {
                    return {
                        image_large_url: item.images.orig?.url || null,
                        pinner: item.pinner,
                        title: item.title,
                        board: item.board,
                        id: item.id,
                        url: item.url
                    }
                }
                return null
            }).filter(img => img !== null)
        }
        return []
    } catch { return [] }
}
