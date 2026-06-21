import fetch from 'node-fetch'
import yts from 'yt-search'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { ytmp3 } = require('@hiudyy/ytdl')

const LimitAud = 700 * 1024 * 1024 // 700MB

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆❌ استخدام غير صحيح*\n*⃝🌙┆✦ مثال:*\n*⃝⚡┆${usedPrefix + command} ويجز الدمعه*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`,
      m
    )
  }

  const yt_play = await search(args.join(' '))
  let youtubeLink = ''
  const arg0 = (args[0] || '').trim()

  if (isYouTubeUrl(arg0)) {
    youtubeLink = arg0
  } else if (/^\d+$/.test(arg0)) {
    const index = parseInt(arg0, 10) - 1
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find(item => item.from === m.sender)
        if (matchingItem) {
          if (index < matchingItem.urls.length) youtubeLink = matchingItem.urls[index]
          else throw '❌ الرقم غير موجود في القائمة'
        } else {
          throw '❌ لا توجد قائمة تشغيل محفوظة لك'
        }
      } else {
        throw '❌ لا توجد قائمة تشغيل محفوظة'
      }
    }
  }

  await conn.reply(m.chat, '*⃝⚡┆⏳ جـاري جـلـب الـصـوت… يـرجـى الانـتـظـار*', m)

  try {
    const target = youtubeLink || yt_play?.[0]?.url
    if (!target) throw new Error('لم يتم العثور على رابط')

    const result = await ytmp3(target)
    let audioData = result
    let isDirect = true
    let fileSize = 0

    if (typeof audioData === 'string') {
      fileSize = await getFileSize(audioData)
      isDirect = false
    }

    const title = yt_play?.[0]?.title || 'صوت نينو'
    const fileName = `${sanitizeFilename(title)}.mp3`

    const messageOptions = {
      [fileSize > LimitAud ? 'document' : 'audio']: isDirect ? audioData : { url: audioData },
      mimetype: 'audio/mpeg',
      fileName: fileName,
      caption: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆✅ تـم تـحـمـيـل الـصـوت بـنـجـاح*\n*⃝🌙┆🎵 الـعنوان: ${title}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n\n ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`
    }

    await conn.sendMessage(m.chat, messageOptions, { quoted: m })

  } catch (e) {
    try {
      const target = youtubeLink || yt_play?.[0]?.url
      const sanka = await getFromSanka(target)
      const audioUrl = sanka.download
      const title = yt_play?.[0]?.title || sanka.title || 'صوت'
      const fileName = `${sanitizeFilename(title)}.mp3`

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: fileName,
        caption: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆✅ تـم تـحـمـيـل الـصـوت بـنـجـاح*\n*⃝🌙┆🎵 الـعنوان: ${title}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n\n ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`
      }, { quoted: m })

    } catch (e2) {
      await conn.reply(m.chat, `*⃝⚡┆❌ حدث خطأ أثناء تحميل الصوت*\n*⃝🌙┆✦ حاول مرة أخرى لاحقًا*`, m)
    }
  }
}

handler.command = /^اغنيه|fgmp3|dlmp3|getaud|yt(a|mp3)$/i
handler.register = true
export default handler

async function search(query, options = {}) {
  const res = await yts.search({ query, hl: 'ar', gl: 'EG', ...options })
  return res.videos
}

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return parseInt(res.headers.get('content-length') || 0)
  } catch { return 0 }
}

function sanitizeFilename(name = 'صوت') {
  return String(name).replace(/[\\/:*?"<>|]/g, '').slice(0, 200)
}

function isYouTubeUrl(u = '') {
  try {
    const { hostname } = new URL(u)
    return /(^|\.)youtube\.com$/.test(hostname) || /(^|\.)youtu\.be$/.test(hostname)
  } catch { return false }
}

async function getFromSanka(youtubeUrl) {
  const endpoint = `https://www.sankavollerei.com/download/ytmp3?apikey=planaai&url=${encodeURIComponent(youtubeUrl)}`
  const res = await fetch(endpoint)
  const json = await res.json()
  return {
    download: json.result.download,
    title: json.result.title
  }
}
