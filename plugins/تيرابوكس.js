import axios from 'axios'

let handler = async (m, { conn, text }) => {

  if (!text) return m.reply(`
━━━╄━✾ 「💠」 ✾━╃━━━
*ارسل رابط تيرابوكس لتحميله*
━━━╄━✾ 「💠」 ✾━╃━━━`)

  if (!text.includes("terabox"))
    return m.reply("❌ الرابط غير صالح")

  await m.reply("⏳ جاري جلب الملف من تيرابوكس...")

  try {

    // API مجاني (يمكن تغييره لاحقاً)
    const { data } = await axios.get(
      `https://api.teradl.xyz/api/terabox?url=${encodeURIComponent(text)}`
    )

    if (!data || !data.download)
      throw "فشل استخراج رابط التحميل"

    const downloadUrl = data.download
    const fileName = data.filename || "terabox-file"

    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      fileName: fileName,
      mimetype: "application/octet-stream"
    }, { quoted: m })

  } catch (err) {

    console.log(err)
    m.reply(`
━━━╄━✾ 「💠」 ✾━╃━━━
*❌ فشل التحميل*
تأكد من صحة الرابط أو أن الملف عام
━━━╄━✾ 「💠」 ✾━╃━━━`)

  }
}

handler.command = /^تيرابوكس$/i
handler.group = false
export default handler