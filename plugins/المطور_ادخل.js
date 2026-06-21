let handler = async (m, { conn, text, usedPrefix, command, args, participants, isOwner }) => {

   if (!isOwner) return conn.sendButton(m.chat, `*دعوة البوت إلى مجموعة*\n\nاهلا @${m.sender.split('@')[0]}\nيمكنك استئجار البوت للانضمام إلى مجموعة\n\n_مزيد من المعلومات انقر على الزر_`.trim(), igfg, null, [
       ['Alquilar', `${usedPrefix}buyprem`]] , m, { mentions: [m.sender] })

  let time = global.db.data.users[m.sender].lastjoin + 86400000
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let delay = time => new Promise(res => setTimeout(res, time))

  let name = m.sender 
  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) throw `✠ ابعت رابط الجروب\n\n 📌 مثال:\n *${usedPrefix + command}* <الرابط> <الايام>\n\n_حط عدد الايام اللي البوت يفضل فيها في الجروب_` 
  if (!code) throw `✠ الرابط غلط !`
  if (!args[1]) throw `📌 عدد الأيام مفقود\n\n مثال:\n *${usedPrefix + command}* <الرابط> 2`
  if (isNaN(args[1])) throw `✠ ارقام فقط!, تمثل الأيام التي سيكون فيها البوت في المجموعة!`
  let owbot = global.owner[1] 
  m.reply(`😎 انتظر 3 ثواني, سأنضم الى المجموعه`)
  await delay(3000)
  try {
  let res = await conn.groupAcceptInvite(code)
  let b = await conn.groupMetadata(res)
  let d = b.participants.map(v => v.id)
  let member = d.toString()
  let e = await d.filter(v => v.endsWith(owbot + '@s.whatsapp.net'))
  let nDays = 86400000 * args[1]  
  let now = new Date() * 1
  if (now < global.db.data.chats[res].expired) global.db.data.chats[res].expired += nDays
  else global.db.data.chats[res].expired = now + nDays
  if (e.length) await m.reply(`✅ لقد دخلت الجروب بنجاح \n\n✠ معلومات الجروب  \n\n *الاسم :* ${await conn.getName(res)}\n\nسيخرج البوت تلقائيًا بعد ذلك \n\n${msToDate(global.db.data.chats[res].expired - now)}`)

 if (e.length) await conn.reply(res, `🏮 مرحبا يارفاق

@${owbot} هو مطوري
لقد تم دعوتي بواسطة *${m.name}*`, m, {
    mentions: d
     }).then(async () => {
     await delay(7000)
     }).then( async () => {
     await conn.reply(res, `فليهدأ الجميع ! 🤭`, 0)
     await conn.reply(global.owner[1]+'@s.whatsapp.net', `⚡ *دعوه للجروب*\n\n@${m.sender.split('@')[0]} دعاني *${conn.user.name}* للجروب\n\n*${await conn.getName(res)}*\n\n*الاي دي* : ${res}\n\n📌 الرابط : ${args[0]}\n\nسيخرج البوت تلقائياً بعد \n\n${msToDate(global.db.data.chats[res].expired - now)}`, null, {mentions: [m.sender]})
     })
     if (!e.length) await conn.reply(global.owner[1]+'@s.whatsapp.net', `≡ *INVITACIÓN A GRUPO*\n\n@${m.sender.split('@')[0]} has invited *${conn.user.name}* to group\n\n*${await conn.getName(res)}*\n\n*ID* : ${res}\n\n📌 link : ${args[0]}\n\nThe bot will exit automatically after\n\n ${msToDate(global.db.data.chats[res].expired - now)}`, null, {mentions: [m.sender]})
     if (!e.length) await m.reply(`|>_<| تم دعوة البوت بنجاح\n\n${await conn.getName(res)}\n\nسيخرج البوت تلقائياً بعد *${msToDate(global.db.data.chats[res].expired - now)}*`).then(async () => {
     let mes = `Hii 👋🏻

*تم دعوتي بواسطة ${m.name}*

لكي ترا جميع اوامري اكتب

${usedPrefix}اوامر
@${conn.user.jid.split('@')[0]} سيخرج تلقائيًا بعد \n\n${msToDate(global.db.data.chats[res].expired - now)}`
  await conn.sendButton(res, mes, igfg, null, [[`✆ Owner`, `${usedPrefix}المطور`], [`⦙☰ Menu`, `${usedPrefix}الاوامر`]], m, {
        mentions: d
         })
     })
    } catch (e) {
      conn.reply(global.owner[1]+'@s.whatsapp.net', e)
      throw `البوت داخل المجموعه`
      }
}
handler.help = ['join <chat.whatsapp.com> <dias>']
handler.tags = ['owner']
handler.command = ['join', 'ادخل'] 

//handler.owner = true

export default handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Days*\n ', h, ' *Hours*\n ', m, ' *Minutes*\n ', s, ' *Seconds* '].map(v => v.toString().padStart(2, 0)).join('')
                                                    }