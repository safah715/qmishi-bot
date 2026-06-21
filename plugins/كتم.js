import fetch from 'node-fetch';

const handler = async (message, { conn, command, text, isAdmin }) => {

  if (!message.isGroup) return;
  if (!isAdmin) throw "⚡ *فـقـط الـمـسـؤولـيـن يـمـكـنـهـم تـنـفـيـذ هـذا الأمـر*";

  let targetJid = message.mentionedJid[0] 
    ? message.mentionedJid[0] 
    : message.quoted 
      ? message.quoted.sender 
      : null;

  if (!targetJid) {
    return conn.reply(
      message.chat,
      command === "كتم"
        ? "⚡ *مـن فـضـلـك مـنـشـن الـشـخـص لـكـتـمـه*"
        : "⚡ *مـن فـضـلـك مـنـشـن الـشـخـص لـفـك الـكـتـم*",
      message
    );
  }

  // حماية البوت
  if (targetJid === conn.user.jid) {
    throw "❌️⃝❄ *لا يـمـكـنـك تـنـفـيـذ الأمـر عـلـى الـبـوت*";
  }

  // حماية المطورين
  const owners = global.owner.map(v => v[0] + '@s.whatsapp.net');
  if (owners.includes(targetJid)) {
    throw "👑⃝⚡ *لا يـمـكـن تـنـفـيـذ الأمـر عـلـى مـطـور الـبـوت*";
  }

  // جلب معلومات القروب
  const groupMetadata = await conn.groupMetadata(message.chat);
  const groupOwner = groupMetadata.owner || message.chat.split('-')[0] + "@s.whatsapp.net";

  if (targetJid === groupOwner) {
    throw "❌️⃝❄ *لا يـمـكـنـك تـنـفـيـذ الأمـر عـلـى صـاحـب الـمـجـمـوعـة*";
  }

  if (!global.db.data.users[targetJid]) {
    global.db.data.users[targetJid] = { muto: false };
  }

  let userData = global.db.data.users[targetJid];

  let responseMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Nino" },
    message: {
      locationMessage: {
        name: "Mute System ✅",
        jpegThumbnail: await (await fetch(
          command === "كتم"
            ? 'https://telegra.ph/file/f8324d9798fa2ed2317bc.png'
            : 'https://telegra.ph/file/aea704d0b242b8c41bf15.png'
        )).buffer(),
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // ===== كتم =====
  if (command === "كتم") {
    if (userData.muto === true) {
      throw "⏳⃝⚡ *هـذا الـمـسـتـخـدم مـكـتـوم بـالـفـعـل*";
    }
    userData.muto = true;
    await message.react('✅');
    conn.reply(
      message.chat,
      "* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*\n\n*تـم كـتـم الـعـضـو بـنـجـاح 🔇⃝⚡*",
      responseMessage,
      { mentions: [targetJid] }
    );
  }

  // ===== فك الكتم =====
  else if (command === "فك_الكتم") {
    if (userData.muto === false) {
      throw "⏳⃝⚡ *هـذا الـمـسـتـخـدم غـيـر مـكـتـوم*";
    }
    userData.muto = false;
    await message.react('✅');
    conn.reply(
      message.chat,
      "* ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙*\n\n*تـم إلـغـاء كـتـم الـعـضـو 🔊⃝🌙*",
      responseMessage,
      { mentions: [targetJid] }
    );
  }
};

handler.all = async function (m) {
  if (!m.isGroup || !global.db.data.users[m.sender]) return;
  let user = global.db.data.users[m.sender];
  if (!user.muto) return;

  const groupMetadata = await this.groupMetadata(m.chat);
  const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

  if (admins.includes(m.sender)) return;

  await this.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.key.id,
      participant: m.sender
    }
  });
};

handler.help = ['كتم ⃝⚡', 'فك_الكتم ⃝🌙'];
handler.command = /^(كتم|فك_الكتم)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
