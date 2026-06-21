//import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import { ogmp3 } from '../lib/youtubedl.js'
const LimitAud = 725 * 1024 * 1024 // 725MB
const LimitVid = 425 * 1024 * 1024 // 425MB
let tempStorage = {}

const handler = async (m, {conn, command, args, text, usedPrefix}) => {
if (!text) return conn.reply(m.chat, `⚡ *يـرجـى إدخـال اسـم الـمـقـطـع أو الـرابط.*\n*مـثـال:* ${usedPrefix + command} ويجز الدمعة`, m)
const yt_play = await search(args.join(' '))
const ytplay2 = await yts(text)
const texto1 = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🎬 *الـعـنـوان:* ${yt_play[0].title}
📅⃝⚡ *الـنـشـر:* ${yt_play[0].ago}
⏰⃝⚡ *الـمـدة:* ${secondString(yt_play[0].duration.seconds)}
📊 *الـمـشـاهـدات:* ${MilesNumber(yt_play[0].views)}
👤 *الـقـنـاة:* ${yt_play[0].author.name}
🔗 *الـرابـط:* ${yt_play[0].url.replace(/^https?:\/\//, '')}

✅ لـتـحـمـيـل الـمـلـف الـصـوتـي: تـفـاعـل بـ (🎶)
✅ لـتـحـمـيـل مـقـطـع الـفـيـديـو: تـفـاعـل بـ (📽)

⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim()

tempStorage[m.sender] = {url: yt_play[0].url, title: yt_play[0].title}

if (m.isWABusiness) {
await conn.sendFile(
m.chat,
yt_play[0].thumbnail,
'error.jpg',
texto1 + '\n\n🎵 لـلـصـوت تـفـاعـل مـع "🎶"\n📹 لـلـفـيـديـو تـفـاعـل مـع "📽"',
m,
null,
fake
)
} else {
await conn.sendMessage(
m.chat,
{
image: {url: yt_play[0].thumbnail},
caption: gt,
footer: texto1,
buttons: [
{buttonId: `.ytmp3 ${yt_play[0].url}`, buttonText: {displayText: '🎵 صــــــوت ⃝⚡'}, type: 1},
{buttonId: `.ytmp4 ${yt_play[0].url}`, buttonText: {displayText: '📹 فـــيديـــو ⃝🌙'}, type: 1}
],
viewOnce: true,
headerType: 4
},
{quoted: m}
)
}
}

handler.before = async (m, {conn}) => {
const text = m.text.trim().toLowerCase()
if (!['🎶', 'audio', '📽', 'video'].includes(text)) return
const userVideoData = tempStorage[m.sender]
if (!userVideoData || !userVideoData.url) return
const [input, qualityInput = text === '🎶' || text === 'audio' ? '320' : '720'] = userVideoData.title.split(' ')
const audioQualities = ['64', '96', '128', '192', '256', '320']
const videoQualities = ['240', '360', '480', '720', '1080']
const isAudio = text === '🎶' || text === 'audio'
const selectedQuality = (isAudio ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : isAudio ? '320' : '720'

const audioApis = [
{url: () => ogmp3.download(userVideoData.url, selectedQuality, 'audio'), extract: (data) => ({data: data.result.download, isDirect: false})},
{url: () => ytmp3(userVideoData.url), extract: (data) => ({data, isDirect: true})},
{
url: () =>
fetch(`https://api.neoxr.eu/api/youtube?url=${userVideoData.url}&type=audio&quality=128kbps&apikey=GataDios`).then((res) => res.json()),
extract: (data) => ({data: data.data.url, isDirect: false})
},
{
url: () => fetch(`${global.APIs.stellar.url}/dow/ytmp3?url=${userVideoData.url}&key=GataDios`).then((res) => res.json()),
extract: (data) => ({data: data?.data?.dl, isDirect: false})
},
{
url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.dl, isDirect: false})
},
{
url: () => fetch(`${apis}/download/ytmp3?url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.status ? data.data.download.url : null, isDirect: false})
},
{
url: () => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.result.download.url, isDirect: false})
}
]

const videoApis = [
{url: () => ogmp3.download(userVideoData.url, selectedQuality, 'video'), extract: (data) => ({data: data.result.download, isDirect: false})},
{url: () => ytmp4(userVideoData.url), extract: (data) => ({data, isDirect: false})},
{
url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.dl, isDirect: false})
},
{
url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${userVideoData.url}&type=video&quality=720p&apikey=GataDios`).then((res) => res.json()),
extract: (data) => ({data: data.data.url, isDirect: false})
},
{
url: () => fetch(`${global.APIs.stellar.url}/dow/ytmp4?url=${userVideoData.url}&key=GataDios`).then((res) => res.json()),
extract: (data) => ({data: data?.data?.dl, isDirect: false})
},
{
url: () => fetch(`${apis}/download/ytmp4?url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.status ? data.data.download.url : null, isDirect: false})
},
{
url: () => fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${userVideoData.url}`).then((res) => res.json()),
extract: (data) => ({data: data.result.media.mp4, isDirect: false})
}
]

const download = async (apis) => {
let mediaData = null
let isDirect = false
for (const api of apis) {
try {
const data = await api.url()
const {data: extractedData, isDirect: direct} = api.extract(data)
if (extractedData) {
const size = await getFileSize(extractedData)
if (size >= 1024) {
mediaData = extractedData
isDirect = direct
break
}
}
} catch (e) {
console.log(`Error con API: ${e}`)
continue
}
}
return {mediaData, isDirect}
}
try {
if (text === '🎶' || text === 'audio') {
await conn.reply(m.chat, `⏳⃝⚡ *جـاري تـحـمـيـل الـمـلـف الـصـوتـي...*`, m)
const {mediaData, isDirect} = await download(audioApis)
if (mediaData) {
const fileSize = await getFileSize(mediaData)
if (fileSize > LimitAud) {
await conn.sendMessage(
m.chat,
{document: isDirect ? mediaData : {url: mediaData}, mimetype: 'audio/mpeg', fileName: `${userVideoData.title}.mp3`},
{quoted: m || null}
)
} else {
await conn.sendMessage(m.chat, {audio: isDirect ? mediaData : {url: mediaData}, mimetype: 'audio/mpeg'}, {quoted: m || null})
}
await m.react('✅')
} else {
await conn.reply(m.chat, '❌⃝❄ عـذراً، تـعـذر تـنـزيـل الـمـلـف.', m || null)
}
} else if (text === '📽' || text === 'video') {
await conn.reply(m.chat, `⏳⃝⚡ *جـاري تـحـمـيـل مـقـطـع الـفـيـديـو...*`, m)
const {mediaData, isDirect} = await download(videoApis)
if (mediaData) {
const fileSize = await getFileSize(mediaData)
const messageOptions = {fileName: `${userVideoData.title}.mp4`, caption: `✅ *تـم الـتـحـمـيـل بـنـجـاح*\n✨ ${userVideoData.title}`, mimetype: 'video/mp4'}
if (fileSize > LimitVid) {
await conn.sendMessage(m.chat, {document: isDirect ? mediaData : {url: mediaData}, ...messageOptions}, {quoted: m || null})
} else {
await conn.sendMessage(m.chat, {video: isDirect ? mediaData : {url: mediaData}, ...messageOptions}, {quoted: m || null})
}
await m.react('✅')
} else {
await conn.reply(m.chat, '❌⃝❄ عـذراً، تـعـذر تـنـزيـل الـفـيـديـو.', m || null)
}
}
} catch (error) {
console.error(error)
} finally {
delete tempStorage[m.sender]
}
}
handler.command = /^(play|شغل2)$/i
handler.register = true
export default handler

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'ar', gl: 'SA', ...options})
return search.videos
}

function MilesNumber(number) {
return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function secondString(seconds) {
seconds = Number(seconds)
const h = Math.floor(seconds / 3600)
const m = Math.floor((seconds % 3600) / 60)
const s = Math.floor(seconds % 60)
return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

async function getFileSize(url) {
try {
const response = await fetch(url, {method: 'HEAD'})
return parseInt(response.headers.get('content-length') || 0)
} catch {
return 0
}
}
