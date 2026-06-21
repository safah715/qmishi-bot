import axios from 'axios';
import cheerio from 'cheerio';
const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎵 اكتب اسم الأغنية أو الفنان*
*⃝🌙┆📝 مثال:*
*⃝⚡┆🔹 ${usedPrefix + command} Joji - Glimpse of Us*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
  );

  try {
    const res = await axios.get(`https://music.apple.com/us/search?term=${encodeURIComponent(text)}`);
    const $ = cheerio.load(res.data);

    let firstItem = $('.grid-item').first();
    let title = firstItem.find('.top-search-lockup__primary__title').text().trim();
    let artist = firstItem.find('.top-search-lockup__secondary').text().trim();
    let link = firstItem.find('.click-action').attr('href');

    if (!title || !link) return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ لم يتم العثور على نتيجة مناسبة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
    );

    // صورة ثابتة مخصصة
    const staticImage = 'https://files.catbox.moe/t0hl4l.jpg';
    const { imageMessage } = await prepareWAMessageMedia({
      image: { url: staticImage },
    }, { upload: conn.waUploadToServer });

    const teksnya = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎵 الــعــنــوان:* ${title}
*⃝🌙┆👤 الــفــنــان:* ${artist}
*⃝⚡┆🌍 الــرابــط:* ${link}
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`;

    const messageContent = {
      buttonsMessage: {
        contentText: teksnya,
        footerText: '𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧* 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n© ʙʏ ʀɪʏᴀᴅ',
        buttons: [
          {
            buttonId: `.ابل-تحميل ${link}`,
            buttonText: { displayText: '🎶 تـحـمـيـل الأغـنـيـة' },
            type: 1
          }
        ],
        headerType: 4,
        imageMessage: imageMessage
      }
    };

    const msg = generateWAMessageFromContent(
      m.chat,
      { ephemeralMessage: { message: messageContent } },
      { userJid: conn.user.id }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error("❌ خطأ:", err);
    m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆⚠️ حدث خطأ أثناء البحث، تأكد من اتصالك أو أعد المحاولة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
    );
  }
};

handler.command = /^(ابل|applemusic)$/i;
export default handler;