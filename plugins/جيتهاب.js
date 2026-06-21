/*
تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁
*/

import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

const handler = async (m, context) => {
  const { conn, text, usedPrefix, command } = context;

  // 1. وظيفة البحث في جيتهاب 🔍⃝⚡
  if (command === 'جيتهاب') {
    if (!text) return conn.reply(m.chat, 
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة الـاسـتـخـدام:*

> ${usedPrefix + command} <اسم المشروع>
> مـثـال: ${usedPrefix + command} whatsapp-bot

⌬──══─┈•⤣⚡⤤•┈─══──⌬`, m);

    await m.react('⏳⃝⚡');

    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=30`;
      const { data } = await axios.get(url);

      if (!data.items.length) throw "❌⃝❄ لـم يـتـم الـعـثـور عـلـى نـتـائـج.";

      let sections = data.items.map((repo) => ({
        title: `📂 ${repo.name} ⃝⚡`,
        highlight_label: '𝑮𝑰𝑻𝑯𝑼𝑼𝑩 ⃝🌙',
        rows: [{
          title: `📥 تـحـمـيـل الـمـسـتـودع`,
          description: `⭐ ${repo.stargazers_count} | 👤 ${repo.owner.login}`,
          id: `${usedPrefix}تحميل ${repo.html_url}`
        }]
      }));

      const interactiveMessage = {
        body: { text: ` ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n\n🔎⃝⚡ *نـتـائـج الـبـحـث عـن:* ${text}` },
        footer: { text: `© ʙʏ ʀɪʏᴀᴅ` },
        header: { hasMediaAttachment: false },
        nativeFlowMessage: {
          buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: '📋⃝⚡ قـائـمـة الـمـسـتـودعـات',
              sections
            })
          }]
        }
      };

      let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: { message: { interactiveMessage } }
      }, { userJid: conn.user.jid, quoted: m });

      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await m.react('✅');

    } catch (e) {
      await m.react('❌⃝❄');
      m.reply(`⚠️⃝⚡ *خـطـأ:* ${e.message || e}`);
    }
  }

  // 2. وظيفة تحميل المستودع 📥⃝⚡
  if (command === 'تحميل') {
    if (!text) return m.reply('*🏮 يـرجـى إدخـال رابـط الـمـسـتـودع.*');
    
    if (!regex.test(text)) throw "⚠️⃝⚡ الـرابـط غـيـر صـالـح.";

    let [_, user, repo] = text.match(regex) || [];
    repo = repo.replace(/.git$/, '');
    const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;

    try {
      await m.react('📥⃝⚡');
      await conn.sendMessage(m.chat, {
        document: { url: zipUrl },
        mimetype: 'application/zip',
        fileName: `${repo}.zip`,
        caption: `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n✅ *تـم تـجـهـيـز الـمـسـتـودع:*\n📂 *الـاسـم:* ${repo}\n\n© ʙʏ ʀɪʏᴀᴅ\n\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`
      }, { quoted: m });
      await m.react('✅');
    } catch (e) {
      await m.react('❌⃝❄');
      m.reply('❌⃝⚡ فـشـل الـتـحـمـيـل.');
    }
  }
};

handler.help = ['جيتهاب ⃝⚡', 'تحميل ⃝🌙'];
handler.tags = ['tools ⃝⚡'];
handler.command = /^(جيتهاب|تحميل)$/i;

export default handler;
