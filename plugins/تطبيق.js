import { download, search } from 'aptoide-scraper'
import axios from 'axios'
import cheerio from 'cheerio'

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `*❌ يرجى كتابة اسم التطبيق*`

  try {
    const res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${text}`)
    const data = await res.json()

    let response = `
    ━━━╄━✾ 「💠」 ✾━╃━━━
┃ *💫 اسم التطبيق:* ${data.name}
┃ *📦 الباكج:* ${data.package}
┃ *🕒 آخر تحديث:* ${data.lastUpdate}
┃ *💪 الحجم:* ${data.size}
┃ *🚀 جاري التحميل*
━━━╄━✾ 「💠」 ✾━╃━━━
`.trim()

    await conn.sendFile(m.chat, data.icon, 'icon.jpg', response, m)

    const apkSize = data.size.toLowerCase()
    if (apkSize.includes('gb') || (apkSize.includes('mb') && parseFloat(apkSize) > 999)) {
      return await conn.sendMessage(m.chat, { text: '*❌ حجم التطبيق كبير ولا يمكن إرساله*' }, { quoted: m })
    }

    await conn.sendMessage(
      m.chat,
      {
        document: { url: data.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${data.name}.apk`
      },
      { quoted: m }
    )

  } catch {
    try {
      const res = await fetch(`${apis}/download/apk?query=${text}`)
      const data = await res.json()
      if (!data.status || !data.data) throw 'error'

      const apkData = data.data
      let response = `
      ━━━╄━✾ 「💠」 ✾━╃━━━
┃ *💫 اسم التطبيق:* ${apkData.name}
┃ *📦 المطور:* ${apkData.developer}
┃ *🕒 تاريخ النشر:* ${apkData.publish}
┃ *💪 الحجم:* ${apkData.size}
┃ *🚀 جاري التحميل*
━━━╄━✾ 「💠」 ✾━╃━━━
`.trim()

      await conn.sendMessage(
        m.chat,
        { image: { url: apkData.image }, caption: response },
        { quoted: m }
      )

      if (apkData.size.includes('GB') || parseFloat(apkData.size.replace(' MB', '')) > 999) {
        return await conn.sendMessage(m.chat, { text: '*❌ حجم التطبيق كبير ولا يمكن إرساله*' }, { quoted: m })
      }

      await conn.sendMessage(
        m.chat,
        {
          document: { url: apkData.download },
          mimetype: 'application/vnd.android.package-archive',
          fileName: `${apkData.name}.apk`
        },
        { quoted: m }
      )

    } catch {
      try {
        const searchA = await search(text)
        const data5 = await download(searchA[0].id)

        let response = `
        ━━━╄━✾ 「💠」 ✾━╃━━━
┃ *💫 اسم التطبيق:* ${data5.name}
┃ *📦 الباكج:* ${data5.package}
┃ *🕒 آخر تحديث:* ${data5.lastup}
┃ *💪 الحجم:* ${data5.size}
┃ *🚀 جاري التحميل*
━━━╄━✾ 「💠」 ✾━╃━━━
`.trim()

        await conn.sendMessage(
          m.chat,
          { image: { url: data5.icon }, caption: response },
          { quoted: m }
        )

        if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
          return await conn.sendMessage(m.chat, { text: '*❌ حجم التطبيق كبير ولا يمكن إرساله*' }, { quoted: m })
        }

        await conn.sendMessage(
          m.chat,
          {
            document: { url: data5.dllink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: data5.name + '.apk'
          },
          { quoted: m }
        )

      } catch (e) {
        conn.sendButton(
          m.chat,
          '*❌ حدث خطأ مؤقت، اضغط على زر إعادة المحاولة*',
          wm,
          null,
          [['*🔁 إعادة المحاولة*', `.apk2 ${text}`]],
          null,
          null,
          m
        )
        handler.limit = false
      }
    }
  }
}

handler.command = /^(تطبيق|apk|modapk|dapk2|aptoide|aptoidedl)$/i
handler.register = true
handler.limit = 2

export default handler