import axios from 'axios';

let handler = async (m, { conn, args }) => {
  try {
    if (args.length < 2) {
      return m.reply(
`📌⃝⚡ *مـثـال اسـتـخـدام:*

فيوز احمر ازيك يااض

🎨 أول كلمة = اللون
📝 باقي الكلام = نص الملصق`
      );
    }

    await m.react("⏳");

    let color = encodeURIComponent(args[0]); // اللون
    let text = encodeURIComponent(args.slice(1).join(" ")); // النص
    let name = encodeURIComponent(m.pushName || "User");

    const api = `https://rest.alyabotpe.xyz/whatsapp/quotesticker?text=${text}&name=${name}&color=${color}&profile=01122805226&key=stellar-YjXF6tBo`;

    const { data } = await axios.get(api);

    if (!data || !data.result) {
      await m.react("❌");
      return m.reply("❌⃝❄ *لـم يـتـم إنـشـاء الـمـلـصـق*");
    }

    const image = await axios.get(data.result, { responseType: "arraybuffer" });

    await conn.sendMessage(m.chat, {
      sticker: Buffer.from(image.data)
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    await m.react("❌");
    m.reply("❌⃝❄ *حـدث خـطـأ أثـنـاء إنـشـاء الـمـلـصـق*");
  }
};

handler.help = ["فيوز ⃝⚡"];
handler.tags = ["tools ⃝🌙"];
handler.command = /^(فيوز)$/i;

export default handler;