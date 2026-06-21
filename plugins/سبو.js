import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (!text) {
    return m.reply(`*🎵 استخدام:*\n${usedPrefix + command} [رابط]\n\n*مثال:*\n${usedPrefix + command} https://open.spotify.com/track/xxxxx`)
  }

  if (!text.includes('open.spotify.com')) {
    return m.reply('❌ لينك غير صحيح!')
  }

  await m.reply('⏳ جاري التنزيل...')

  try {
    // خطوة 1: bypass Cloudflare
    console.log('Step 1: Bypassing Cloudflare...')
    const bypassResponse = await axios.get(
      'https://gojo-cloud-flare-bypass.vercel.app/api/v1/tools/bypass?url=https://sssspotify.com/ar',
      {  
        timeout: 30000,
        validateStatus: () => true
      }
    )

    if (!bypassResponse.data || !bypassResponse.data.status) {
      throw new Error('Cloudflare bypass failed')
    }

    console.log('Step 1: Cloudflare bypassed successfully ✓')

    // خطوة 2: استدعاء API
    console.log('Step 2: Calling Spotify API...')
    
    const apiResponse = await axios({
      method: 'POST',
      url: 'https://sssspotify.com/api/download/get-url',
      data: { url: text },
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://sssspotify.com',
        'referer': 'https://sssspotify.com/ar',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      timeout: 60000,
      validateStatus: () => true
    })

    console.log('API Response status:', apiResponse.status)
    console.log('API Response data:', JSON.stringify(apiResponse.data, null, 2))

    const d = apiResponse.data

    // هنا الحل: originalVideoUrl موجود لكنه رابط نسبي
    if (d && d.originalVideoUrl) {
      // نحول لينك النسبي لرابط كامل
      const downloadUrl = d.originalVideoUrl.startsWith('http') 
        ? d.originalVideoUrl 
        : `https://sssspotify.com${d.originalVideoUrl}`
      
      console.log('Step 2: Download link obtained ✓')
      console.log('Download URL:', downloadUrl)
      
      // خطوة 3: تحميل الأغنية
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${d.title || 'spotify'}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: d.title || 'Spotify Music',
            body: d.authorName || 'Unknown Artist',
            thumbnailUrl: d.coverUrl || undefined,
            sourceUrl: text,
            mediaType: 1,
            showAdAttribution: false,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })

      console.log('Step 3: Audio sent successfully ✓')
      return

    } else {
      console.error('No download link in response:', d)
      throw new Error('No download link received from API')
    }

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    // محاولة بديلة: Fabdl API
    try {
      console.log('Trying alternative API: Fabdl...')
      
      const res = await axios.get(
        `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(text)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 40000
        }
      )

      if (res.data && res.data.result) {
        const data = res.data.result
        
        const downloadRes = await axios.get(
          `https://api.fabdl.com/spotify/mp3-convert-task/${data.gid}/${data.id}`,
          {
             headers: { 'User-Agent': 'Mozilla/5.0' },
             timeout: 40000
           }
        )

        if (downloadRes.data && downloadRes.data.result && downloadRes.data.result.download_url) {
          await conn.sendMessage(m.chat, {
            audio: { url: downloadRes.data.result.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${data.name || 'spotify'}.mp3`,
            contextInfo: {
              externalAdReply: {
                title: data.name,
                body: data.artists,
                thumbnailUrl: data.image,
                sourceUrl: text,
                mediaType: 1
              }
            }
          }, { quoted: m })
          
          console.log('Alternative API worked ✓')
          return
        }
      }

    } catch (altError) {
      console.error('Alternative API also failed:', altError.message)
    }

    return m.reply(`❌ *فشل التحميل!*

*الأسباب المحتملة:*
- الخوادم مشغولة حالياً
- لينك غير صحيح

*الحل:*
- حاول مرة أخرى بعد دقيقة
- تأكد من لينك

*Error:* ${error.message}`)
  }
}

handler.help = ['سبوت']
handler.tags = ['downloader']
handler.command = /^(سبو|spotify|sp)$/i
handler.limit = true

export default handler