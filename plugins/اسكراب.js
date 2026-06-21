import axios from "axios";

const API_KEY = "stellar-YjXF6tBo";
const BASE_URL = "https://rest.alyabotpe.xyz/ai/chatgpt";

let handler = async (m, { text }) => {
  try {

    if (!text)
      return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🤖 مولد الأكواد الذكي*
*⃝🌙┆✦ اكتب وصف الكود الذي تريده*
*⃝⚡┆📝 مثال: اصنع كود بنترست*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)

    await m.reply("*⃝⚡┆⏳ جاري تحليل طلبك وإنشاء الكود...*")

    const prompt = `
أنت مطور بوت واتساب Baileys محترف.
اصنع أي كود JS أو Plugin ES Module كامل وجاهز.
لا تشرح شيئًا، أرسل الكود فقط.
الوصف التالي:
${text}
    `

    const res = await axios.get(BASE_URL, {
      params: {
        text: prompt,
        key: API_KEY
      },
      timeout: 30000
    })

    const result = res?.data?.response || res?.data?.reply || res?.data?.result

    if (!result)
      return m.reply("*⃝⚡┆❌ فشل توليد الكود من المصدر*")

    await m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆💻 الكود الجاهز:*

\`\`\`js
${result}
\`\`\`
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*

 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`)

  } catch (err) {
    console.error(err)
    m.reply("*⃝⚡┆❌ حدث خطأ غير متوقع أثناء التوليد*")
  }
};

handler.help = ['مولد'];
handler.tags = ['ai'];
handler.command = /^(اسكراب|مولد)$/i;

export default handler;
