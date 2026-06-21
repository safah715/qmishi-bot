/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

let handler = async (m, { conn, command, text }) => {

  if (!text) {
    await m.react('⚡')
    return conn.reply(m.chat, '*⚠️⃝⚡ يـرجـى إدخـال اسـم أو عـمـل مـنـشـن لـتـحـلـيـل الـشـخـصـيـة.*', m)
  }

  await m.react('⏳⃝⚡')

  let stats = ['6%','12%','20%','35%','41%','49%','54%','60%','73%','84%','92%','99%','1%','0%']
  
  let personalidad = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

✨⃝⚡ *تـحـلـيـل الـشـخـصـيـة لـ:* ${text}

📊 *الـمـعـنـويـات:* ${pickRandom(stats)}
📉 *الـأخـلاق:* ${pickRandom(stats)}
🧠 *الـذكـاء:* ${pickRandom(stats)}
🔥 *الـشـجـاعـة:* ${pickRandom(stats)}
🎭 *الـشـهـرة:* ${pickRandom(stats)}
🔞 *الـانـحـراف:* ${pickRandom(stats)}

🧩 *نـوع الـشـخـصـيـة:* ${pickRandom(['ذو قـلـب طـيـب', 'مـتـعـجـرف', 'سـخـي', 'مـتـواضـع', 'خـجـول', 'فـضـولـي', 'ذكـي جـداً', 'هـادئ'])}

⏳ *الـحـالـة الـدائـمـة:* ${pickRandom(['مـشـتـت الـانـتـبـاه', 'يـشـاهـد الـأنـمـي', 'عـلـى الـهـاتـف دائـمـاً', 'يـفـكـر فـي الـمـسـتـقـبـل', 'يـضـيـع الـوقـت', 'مـبـدع'])}

🚻 *الـتـوجـه:* ${pickRandom(['رجل', 'امرأة', 'مستقيم', 'فضائي 👽', 'شخصية أسطورية'])}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`

  await conn.reply(m.chat, personalidad, m, { mentions: conn.parseMention(personalidad) })
  await m.react('✅')
}

handler.help = ['شخصية ⃝⚡']
handler.tags = ['fun ⃝🌙']
handler.command = /^(personalidad|شخصيه|شخصية|الشخصيه|الشخصية)$/i

export default handler 

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
