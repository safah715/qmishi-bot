/*
تـم الـتـنـسـيـق بـواسـطـة: 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 🌙 ࣪𓂃
*/

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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {

    if (!text)
      return m.reply(`⚡ *يـرجـى كـتـابـة وصـف الـصـورة بـعـد الـأمـر*\n*مـثـال:* ${usedPrefix + command} قطة سايبربنك`)

    await m.reply("⏳⃝⚡ *جـاري مـعـالـجـة الـوصـف والـتـرجـمـة...*")

    const englishPrompt = await translateToEnglish(text)

    await m.reply("🎨⃝⚡ *جـاري تـولـيـد الـصـورة، انـتـظـر قـلـيـلـاً...*")

    const apiUrl = `https://api-tyson-md.vercel.app/api/ai/imagine?prompt=${encodeURIComponent(englishPrompt)}&model=img&password=${encodeURIComponent(API_PASSWORD)}`

    const res = await axios.get(apiUrl, { timeout: 20000 })
    const data = res?.data
    const resultUrl = data?.url || data?.result || data?.data?.url

    if (!resultUrl)
      return m.reply("❌⃝❄ *فـشـل تـولـيـد الـصـورة، حـاول مـرة أخـرى*")

    // النتيجة النهائية تظهر هنا فقط الحقوق
    let successCaption = ` ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n` +
                         `✅ *تـم تـولـيـد الـصـورة بـنـجـاح*\n\n` +
                         `⚡ *الـوصـف:* ${text}\n` +
                         `📅⃝⚡ *الـتـاريخ:* ${new Date().toLocaleDateString()}\n\n` +
                         `© ʙʏ ʀɪʏᴀᴅ`.trim();

    await conn.sendMessage(
      m.chat,
      {
        image: { url: resultUrl },
        caption: successCaption
      },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    m.reply("⚠️⃝⚡ *حـدث خـطأ أثـنـاء الـتـنـفـيـذ، حـاول لـاحـقـاً*")
  }
};

handler.command = /^(توليد)$/i
export default handler;
