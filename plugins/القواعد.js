// تــم الــتـــطـــويـــر بـــواســـطـــه ايــــســــكـــانـــور 🍁

import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    let imgUrl = 'https://files.catbox.moe/7twpdk.jpg';

    // تحميل الصورة
    let response = await fetch(imgUrl);
    let img = await response.buffer();

    let str = `
˚₊‧꒰ مــاش ♡ ໒꒱ ‧₊˚
⌬──══─┈•⤣⚡⤤•┈─══──⌬
    ᯓ⍣⃝🌙 *قـوانـيـن الـمـجـمـوعـة* 🌙 ࣪𓂃
⌬──══─┈•⤣⚡⤤•┈─══──⌬

👋⃝🌙 *أهـلاً بـك يـا:* ${taguser}
📜⃝🌙 *الـمـهـمة:* الالتزام بالنظام
⚖️⃝🌙 *الـحـالـة:* فحص القوانين...

⌬──══─┈•⤣⚡⤤•┈─══──⌬
   📌⃝🍸 *مـخـالـفـات التـنـبـيـه*
⌬──══─┈•⤣⚡⤤•┈─══──⌬

①⃝🍸 التحدث بلغة غير العربية.
②⃝🍸 مضايقة الأعضاء أو التنمر.
③⃝🍸 إرسال رسائل صوتية مزعجة.
④⃝🍸 تـنـبـيـهـيـن = إنـذار فـوري.

⌬──══─┈•⤣⚡⤤•┈─══──⌬
   ⚠️⃝🍸 *مـخـالـفـات الإنـذار*
⌬──══─┈•⤣⚡⤤•┈─══──⌬

❶⃝🌙 الحرق المتعمد للأحداث.
❷⃝🌙 الاعتراض على قرار المشرف.
❸⃝🌙 إرسال 5 رسائل متتالية (سبام).
❹⃝🌙 التحدث عن محتوى غير لائق.

⌬──══─┈•⤣⚡⤤•┈─══──⌬
   🔥⃝🍸 *الـطـرد الـمـؤبـد*
⌬──══─┈•⤣⚡⤤•┈─══──⌬

🚫⃝🌙 شتم أي عضو أو مشرف.
🚫⃝🌙 سب الدين أو السياسة.
🚫⃝🌙 نشر روابط مجموعات أخرى.
🚫⃝🌙 إرسال محتوى فاحش (+18).

꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷꒦꒷؛𓈒َِ🌙𐦟َِ؍ۥ۬ ꒷꒦꒷꒦꒷꒷꒷꒦꒷꒷
> مــاش بــيـــحـــبــك 🫦🍸
⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim();

    await conn.sendMessage(m.chat, {
      image: img,
      caption: str,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: "📜 دسـتـور مـخـتـبر مــاش",
          body: "بـواسطـة: ʀɪʏᴀᴅ 🍁",
          thumbnail: img,
          sourceUrl: "https://chat.whatsapp.com/JiCkjOX3ZesGVwg77wDaTj"
        }
      }
    }, { quoted: m });

    await m.react("📜");

  } catch (err) {
    console.error(err);
    m.reply("❌ حدث خطأ أثناء عرض القوانين.");
  }
};

handler.help = ['القوانين'];
handler.tags = ['main'];
handler.command = /^(القواعد|rule|القوانين|rules)$/i;

export default handler;