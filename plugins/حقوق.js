/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

import { addExif } from '../lib/sticker.js'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Sticker } = require('wa-sticker-formatter');

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!m.quoted) {
    await m.react('⚡');
    return conn.reply(m.chat, 
`⌬──══─┈•⤣⚡⤤•┈─══──⌬

⚡ *طـريـقـة تـغـيـيـر الـحقـوق:*

> قـم بـالـرد عـلى مـلـصـق مـع كـتـابـة:
> ${usedPrefix + command} الـحـزمة|الـمؤلـف

⌬──══─┈•⤣⚡⤤•┈─══──⌬`, m);
  }

  let stiker = false;
  try {
    let [packname, ...author] = text.split('|');
    author = (author || []).join('|');
    
    let mime = m.quoted.mimetype || '';
    if (!/webp/.test(mime)) throw '⚠️⃝⚡ الـرد يـجـب أن يـكـون عـلى مـلـصـق فـقـط!';

    await m.react('⏳⃝⚡');
    let img = await m.quoted.download();
    if (!img) throw '📥⃝⚡ فـشـل تـحـمـيـل الـمـلـصـق، حـاول مـجـدداً.';

    // تـغـيـيـر الـحقـوق (Exif)
    stiker = await addExif(img, packname || '𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⃝⚡', author || '© ʀɪʏᴀᴅ');

  } catch (e) {
    console.error(e);
    if (Buffer.isBuffer(e)) stiker = e;
  } finally {
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true });
      await m.react('✅');
    } else {
      await m.react('❌⃝❄');
      await conn.reply(m.chat, `⚠️⃝⚡ *حـدث خـطـأ:* تـأكـد مـن الـرد عـلى مـلـصـق صـحـيـح.`, m);
    }
  }
}

handler.help = ['حقوق ⃝⚡', 'سرقة ⃝🌙'];
handler.tags = ['sticker ⃝⚡'];
handler.command = /^(حقوق|سرقة)$/i;

export default handler;
