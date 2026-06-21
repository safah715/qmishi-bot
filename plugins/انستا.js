import fetch from 'node-fetch'
import axios from 'axios'
//import instagramGetUrl from 'instagram-url-direct';
//import { instagram } from '@xct007/frieren-scraper';
//import { instagramdl } from '@bochilteam/scraper';

const handler = async (m, { conn, args, command, usedPrefix }) => {

if (!args[0])
throw `*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ ⓘ استخدام خاطئ*
*│ ❌ الرجاء إدخال رابط إنستجرام*
*│ 📝 مثال:*
*│ ${usedPrefix + command} https://www.instagram.×××××*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`

const { key } = await conn.sendMessage(m.chat, {
text: `*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ ⏳ جارِ التحميل...*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`
})

await conn.sendMessage(m.chat, { text: '*⏳ جاري المعالجة...*', edit: key })
await conn.sendMessage(m.chat, { text: '*⌛ يرجى الانتظار...*', edit: key })
await conn.sendMessage(m.chat, { text: '*🔄 يتم جلب المحتوى...*', edit: key })

try {
const res = await fetch(`https://api.delirius.store/download/instagram?url=${args}`)
const data = await res.json()

const fileType = data.data[0].url.includes('.webp') ? 'image' : 'video'
const downloadUrl = data.data[0].url

if (fileType === 'image') {
await conn.sendFile(
m.chat,
downloadUrl,
'ig.jpg',
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🖼️ تم تحميل الصورة*
*│ 🎁 الجودة: أصلية*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
m
)
await conn.sendMessage(m.chat, { text: '*✅ تم بنجاح*', edit: key })
}

else if (fileType === 'video') {
await conn.sendFile(
m.chat,
downloadUrl,
'ig.mp4',
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🎬 تم تحميل الفيديو*
*│ 🎁 الجودة: أصلية*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
m
)
await conn.sendMessage(m.chat, { text: '*✅ تم بنجاح*', edit: key })
}

} catch {

try {
const apiUrl = `${apis}/download/instagram?url=${encodeURIComponent(args[0])}`
const apiResponse = await fetch(apiUrl)
const delius = await apiResponse.json()

if (!delius || !delius.data || delius.data.length === 0) return m.react('❌')

const downloadUrl = delius.data[0].url
const fileType = delius.data[0].type

if (!downloadUrl) return m.react('❌')

if (fileType === 'image') {
await conn.sendFile(m.chat, downloadUrl, 'ig.jpg',
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🖼️ صورة إنستجرام*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
m
)
}

else if (fileType === 'video') {
await conn.sendFile(m.chat, downloadUrl, 'ig.mp4',
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🎬 فيديو إنستجرام*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
m
)
}

} catch {

try {
const apiUrll = `https://api.delirius.store/download/instagram?url=${encodeURIComponent(args[0])}&apikey=bot-secx3`
const responsel = await axios.get(apiUrll)
const resultl = responsel.data

for (const item of resultl.message) {
const shortUrl = await (await fetch(`https://api.delirius.store/download/instagram?url=${item.thumbnail}`)).text()

const txt =
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🔗 رابط مختصر*
*│ ${shortUrl}*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`

await conn.sendFile(m.chat, item._url, null, txt, m)
await new Promise(resolve => setTimeout(resolve, 10000))
}

} catch {

try {
const human = await fetch(`https://api.delirius.store/download/instagram?url=${lolkeysapi}&url=${args[0]}`)
const json = await human.json()
const videoig = json.result

await conn.sendFile(
m.chat,
videoig,
'ig.mp4',
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ 🎬 تم التحميل بنجاح*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
m
)

} catch (e) {

conn.sendMessage(m.chat, {
text:
`*⌬──══─┈•⤣🪐⤤•┈─══──⌬*
*│ ❌ فشل تحميل الرابط*
*│ 🛠️ أرسل تقريراً بالأمر*
*│ ${usedPrefix + command}*
*⌬──══─┈•⤣🪐⤤•┈─══──⌬*`,
edit: key
})

console.log(e)
}
}
}
}
}

handler.help = ['instagram <link>']
handler.tags = ['downloader']
handler.command = /^(انستا|ig(dl)?)$/i
handler.limit = 2
handler.register = true

export default handler