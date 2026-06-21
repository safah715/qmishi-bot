import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";
import fetch from "node-fetch";

const timeout = 60000;
const reward = 500;

let handler = async (m, { conn, command }) => {

  conn.obito = conn.obito || {};
  const id = m.chat;

  // 🎯 الرد على الأزرار
  if (command.startsWith("مجوب_")) {

    let obito = conn.obito[id];
    if (!obito) {
      await m.react("⏳");
      return conn.reply(m.chat, "⏳⃝⚡ *لا تـوجـد لـعـبـة نـشـطـة حـالـيـاً*", m);
    }

    let selectedIndex = parseInt(command.split("_")[1]);

    if (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > 4) {
      await m.react("❌⃝❄");
      return conn.reply(m.chat, "❌⃝❄ *اخـتـيـار غـيـر صـالـح*", m);
    }

    let selectedAnswer = obito.options[selectedIndex - 1];
    let isCorrect = obito.correctAnswer === selectedAnswer;

    if (isCorrect) {

      await m.react("✅");

      await conn.reply(
        m.chat,
        `✅ *إجـابـة صـحـيـحـة يـا بـطـل!*\n💰⃝⚡ *الـجـائـزة:* ${reward}xp`,
        m
      );

      if (global.db?.data?.users?.[m.sender]) {
        global.db.data.users[m.sender].exp += reward;
      }

      clearTimeout(obito.timer);
      delete conn.obito[id];

    } else {

      obito.attempts -= 1;

      if (obito.attempts > 0) {

        await m.react("❌");

        await conn.reply(
          m.chat,
          `❌⃝❄ *إجـابـة خـاطـئـة!*\n🔄⃝⚡ *مـحـاولات مـتـبـقـيـة:* ${obito.attempts}`,
          m
        );

      } else {

        await m.react("❌");

        await conn.reply(
          m.chat,
          `⛔⃝⚡ *انـتـهـت مـحـاولاتـك!*\n✅ *الـإجـابـة الـصـحـيـحـة:* ${obito.correctAnswer}`,
          m
        );

        clearTimeout(obito.timer);
        delete conn.obito[id];
      }
    }

    return;
  }

  // 🎯 بدء اللعبة
  try {

    if (conn.obito[id]) {
      await m.react("⏳");
      return conn.reply(m.chat, "⏳⃝⚡ *لـديـك لـعـبـة نـشـطـة بـالـفـعـل*", m);
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/DK3MK/worker-bot/main/eye.json"
    );

    const data = await response.json();

    if (!data.length) throw new Error("No Data");

    const item = data[Math.floor(Math.random() * data.length)];
    const { img, name } = item;

    let options = [name];

    while (options.length < 4) {
      let random = data[Math.floor(Math.random() * data.length)].name;
      if (!options.includes(random)) options.push(random);
    }

    options.sort(() => Math.random() - 0.5);

    const media = await prepareWAMessageMedia(
      { image: { url: img } },
      { upload: conn.waUploadToServer }
    );

    const interactiveMessage = {
      body: {
        text: `⌬──══─┈•⤣⚡⤤•┈─══──⌬

👁️⃝⚡ *لـعـبـة "تـخـمـيـن الـعـيـن"*

⏰⃝⚡ *الـوقـت:* 60 ثـانـيـة
💰⃝⚡ *الـجـائـزة:* ${reward}xp

✅ *تـعـرّف عـلـى شـخـصـيـة الأنـمـي مـن الـعـيـن*

 ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙`.trim(),
      },

      footer: { text: "© ʙʏ ʀɪʏᴀᴅ" },

      header: {
        hasMediaAttachment: true,
        imageMessage: media.imageMessage,
      },

      nativeFlowMessage: {
        buttons: options.map((option, index) => ({
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: `${index + 1}⃝⚡ 『${option}』`,
            id: `.مجوب_${index + 1}`
          })
        })),
      },
    };

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: { interactiveMessage },
        },
      },
      { userJid: conn.user.jid, quoted: m }
    );

    await m.react("✍️");

    await conn.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id
    });

    conn.obito[id] = {
      correctAnswer: name,
      options: options,
      attempts: 2,
      timer: setTimeout(async () => {
        if (conn.obito[id]) {
          await conn.reply(
            m.chat,
            `⏰⃝⚡ *انـتـهـى الـوقـت الـمـحـدد!*\n✅ *الـإجـابـة الـصـحـيـحـة:* ${name}`,
            m
          );
          delete conn.obito[id];
        }
      }, timeout)
    };

  } catch (e) {
    console.error(e);
    await m.react("❌⃝❄");
    conn.reply(m.chat, "❌⃝❄ *حـدث خـطـأ أثـنـاء بـدء الـلـعـبـة*", m);
  }
};

handler.help = ["عين"];
handler.tags = ["games"];
handler.command = /^(عين|مجوب_\d+)$/i;

export default handler;