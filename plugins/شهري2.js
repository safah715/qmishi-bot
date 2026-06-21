const itemMapping = {
  money: '💲⃝⚡ نــقــود',
  exp: '🆙⃝⚡ الــخــبــرة',
  trash: '🗑️⃝⚡ قــمــامــة',
  potion: '🏺⃝⚡ جــرعــة',
  diamond: '💎⃝⚡ الــمــاس',
  wood: '🪵⃝⚡ خــشــب',
  rock: '🪨⃝⚡ حــجــر',
  string: '🕸️⃝⚡ خــيــط',
  emerald: '✧⃝⚡ زمــــرد',
  berlian: '⚙️⃝⚡ فــضــة',
  iron: '🔩⃝⚡ حــديــد',
  pet: '🦴⃝⚡ حــيــوان',
  petFood: '🍖⃝⚡ لــلحــم',
  joincount: '🪙⃝⚡ ذهــــب',
  uncommon: '📦⃝⚡ شــائــع',
  common: '📦⃝⚡ نــادر',
  legendary: '📦⃝⚡ اســطــوري',
  mythic: '📦⃝⚡ خــرافــي',
}

const rewards = {
  exp: 135000,
  money: 45000,
  trash: 9500,
  mythic: 14,
  legendary: 6,
  common: 4,
  uncommon: 8,
}
const cooldown = 2592000000

let handler = async (m, { conn, usedPrefix, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let time = user.lastmonthly + cooldown
  
  if (new Date() - user.lastmonthly < cooldown) {
    await m.react('⏳⃝⚡')
    throw `⌬──══─┈•⤣⚡⤤•┈─══──⌬

🌙⃝⚡ *لـقـد طـالـبـت بـالـهـديـة بـالـفـعـل*
⏳⃝⚡ *انـتـظـر يـا بـطـل*
⏰⃝⚡ *الـمـتـبـقـي:* ${msToTime(time - new Date())}

⌬──══─┈•⤣⚡⤤•┈─══──⌬`.trim()
  }

  let text = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n🎁⃝⚡ *الـمـكـافـأة الـشـهـريـة*\n✅ *لـقـد تـلـقـيـت الـآتـي:*\n\n`
  
  for (let reward of Object.keys(rewards)) {
    if (reward in itemMapping) {
      user[reward] += rewards[reward]
      text += `✨ ${itemMapping[reward]} | +${rewards[reward]}\n`
    }
  }

  text += `\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙\n⌬──══─┈•⤣⚡⤤•┈─══──⌬`

  user.lastmonthly = new Date() * 1
  await m.react('✅')
  m.reply(text)
}

handler.help = ['شهريا ⃝⚡', 'شهري ⃝⚡']
handler.tags = ['xp ⃝🌙']
handler.command = /^(شهري2|شهريا|monthly)$/i

export default handler

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let days = Math.floor(duration / (1000 * 60 * 60 * 24))

  return `${days} يوم و ${hours} ساعة`
}
