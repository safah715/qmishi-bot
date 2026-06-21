import fetch from 'node-fetch'
import yts from 'yt-search'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { ytmp3, ytmp4 } = require('@hiudyy/ytdl')

async function search(query, options = {}) {
  const s = await yts.search({ query, hl: 'ar', gl: 'EG', ...options })
  return s.videos
}

async function resolveYouTubeTarget(m, args) {
  const yt_play = await search(args.join(' '))
  let youtubeLink = ''

  if (args[0]?.includes('you')) {
    youtubeLink = args[0]
  }

  const target = youtubeLink || yt_play?.[0]?.url
  if (!target) throw '❌⃝❄ لـم يـتـم الـعـثـور عـلـى نـتـائـج صـالـحـة'

  const title = yt_play?.[0]?.title || 'مقطع يوتيوب'
  const thumb = yt_play?.[0]?.thumbnail

  return { target, title, thumb }
}

const handler = async (m, { conn, command, args }) => {
  if (!args[0]) {
    await m.react('⚡')
    return conn.reply(
      m.chat,
      `*╭━ ⚠️ تـنـبـيـه ━━⃝⚡*\n*│* ⚡ *الـاسـتـخـدام الـخـاطـئ*\n*│* ✅ *مـثـال:* .${command} سورة الكهف\n*╰━━━━━━━━━━━━━⃝🌙*`,
      m
    )
  }

  try {
    const isAudio = /^(صوت)$/i.test(command)
    const isVideo = /^(فيديو|ytmp4)$/i.test(command)

    await m.react('⏳⃝⚡')
    await conn.reply(m.chat, '⏳⃝⚡ *جـاري تـحـضـيـر الـطـلـب...*', m)

    const { target, title, thumb } = await resolveYouTubeTarget(m, args)

    /* ====== تـحـمـيـل صـوت ====== */
    if (isAudio) {
      const audio = await ytmp3(target)

      await conn.sendMessage(
        m.chat,
        {
          audio: typeof audio === 'string' ? { url: audio } : audio,
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`,
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: '🎵 تـم الـتـحـمـيـل بـنـجـاح ⃝⚡',
              thumbnailUrl: thumb,
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: 'https://whatsapp.com/channel/0029Vb7O26W8V0tu5ErixM1d'
            }
          }
        },
        { quoted: m }
      )
      await m.react('✅')
      return
    }

    /* ====== تـحـمـيـل فـيـديـو ====== */
    if (isVideo) {
      const video = await ytmp4(target)
      const out = typeof video === 'string' ? video : video?.url || video?.result || video

      const captionVid = `*╭━━ 🎬 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐋 ━━⃝⚡*\n*│*\n*│* ⚡ *الـعـنـوان:* ${title}\n*│* ✅ *الـحـالـة:* تـم الـتـحـمـيـل\n*│*\n*╰━━━━━━━━━━━━━⃝🌙*\n\n ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 `.trim()

      await conn.sendMessage(
        m.chat,
        {
          video: typeof out === 'string' ? { url: out } : out,
          mimetype: 'video/mp4',
          caption: captionVid,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: '🎥 تـم تـحـمـيـل الـفـيـديـو ⃝🌙',
              thumbnailUrl: thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      )
      await m.react('✅')
      return
    }
  } catch (e) {
    console.log(e)
    await m.react('❌⃝❄')
    return conn.reply(
      m.chat,
      `*❌⃝❄ حـدث خـطأ أثـنـاء الـتـحـمـيـل*\n⚡ تـأكـد مـن الـرابـط أو حـاول لاحـقـاً.`,
      m
    )
  }
}

handler.help = ['صوت ⃝⚡', 'فيديو ⃝🌙']
handler.tags = ['downloader ⃝🌙']
handler.command = /^(صوت|ytmp4|فيديو)$/i
handler.register = true

export default handler
