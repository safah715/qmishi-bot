import axios from "axios";

const API_PASSWORD = "t5y6s8o2n*n1a4r9u0t3o";

async function translateToEnglish(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    return res.data[0].map(t => t[0]).join("");
  } catch {
    return text; 
  }
}

let handler = async (m, { conn, text, command }) => {
  try {

    if (!text)
      return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎨 اكتب وصف الصورة بعد الأمر*
*⃝🌙┆📝 مثال: .${command} قطة في الفضاء*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)

    await m.reply(`*⃝⚡┆⏳ جاري معالجة الوصف والترجمة...*`)

    const englishPrompt = await translateToEnglish(text)

    await m.reply(`*⃝🌙┆🖼️ جاري إنشاء صورتك، انتظر لحظة...*`)

    const apiUrl = `https://api-tyson-md.vercel.app/api/ai/imagine?prompt=${encodeURIComponent(englishPrompt)}&model=img&password=${encodeURIComponent(API_PASSWORD)}`

    const res = await axios.get(apiUrl, { timeout: 30000 })
    const data = res?.data
    const resultUrl = data?.url || data?.result || data?.data?.url

    if (!resultUrl)
      return m.reply(`*⃝⚡┆❌ فشل إنشاء الصورة، ربما السيرفر مضغوط*`)

    await conn.sendMessage(
      m.chat,
      {
        image: { url: resultUrl },
        caption: `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎨 تم إنشاء الصورة بنجاح*
*⃝🌙┆📝 الوصف: ${text}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
© ʙʏ ʀɪʏᴀᴅ`
      },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    m.reply(`*⃝⚡┆❌ حدث خطأ غير متوقع أثناء الرسم*`)
  }
};

handler.command = /^(ارسم|تخيل)$/i
export default handler
