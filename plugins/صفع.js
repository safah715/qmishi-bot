import { sticker } from "../lib/sticker.js";
import fetch from "node-fetch";

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else { 
        who = m.chat;
    }

    const textquien = `⚡ *اعـمـل مـنـشـن عـلـى الـشـخـص الـذي تـريـد صـفـعـه*\n✅ مـثـال: ${usedPrefix + command} @منشن`;

    if ((who === m.chat && m.isGroup) || (!who && m.isGroup)) {
        await m.react('⚡')
        return conn.reply(m.chat, textquien, m, { mentions: conn.parseMention(textquien) });
    }

    try {
        await m.react('⏳⃝⚡')
        let name;
        if (who === m.chat) {
            name = " ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 ";
        } else {
            name = conn.getName(who);
        }
        
        let name2 = conn.getName(m.sender);
        let apislap = await fetch(`https://api.waifu.pics/sfw/slap`);
        let jkis = await apislap.json();
        let { url } = jkis;

        // وضع الزخرفة الصحيحة في حقوق الملصق (مرة واحدة)
        let stiker = await sticker(null, url, `${name2} صفع ${name}`, ` ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 `);
        
        await conn.sendFile(m.chat, stiker, null, { asSticker: true }, m, true, { 
            contextInfo: { forwardingScore: 200, isForwarded: true } 
        }, { quoted: m });
        
        await m.react('✅')
    } catch (e) {
        await m.react('❌⃝❄')
        throw `❌⃝❄ *حـصـل خـطأ أثـنـاء مـعـالـجـة الـطـلـب*`;
    }
};

handler.help = ["slap ⃝⚡", "صفع ⃝⚡"];
handler.tags = ["General ⃝🌙"];
handler.command = /^(slap|صفع)$/i;

export default handler;
