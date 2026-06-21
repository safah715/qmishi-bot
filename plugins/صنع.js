let handler = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  let done = '🔨⃝⚡'
  m.react(done)
  
  global.db.data.users[m.sender].pickaxe = global.db.data.users[m.sender].pickaxe || 0
  global.db.data.users[m.sender].pedang = global.db.data.users[m.sender].pedang || 0
  global.db.data.users[m.sender].fishingrod = global.db.data.users[m.sender].fishingrod || 0

  let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬

📌⃝⚡ *مـثـال عـلـى اسـتـخـدام الأمـر:*
${usedPrefix + command} سيف

📜⃝⚡ *الأصـنـاف الـتـي يـمـكـن صـنـعـهـا:*
🛠️⃝⚡ معول ⛏️⃝⚡
🛠️⃝⚡ سيف 🗡️⃝⚡
🛠️⃝⚡ صنارة 🎣⃝⚡
🛠️⃝⚡ درع 🛡️⃝⚡
🛠️⃝⚡ بطاقة 💳⃝⚡

⛏️⃝⚡ *مـتـطـلـبـات صـنـع مـعـول:*
🪵⃝⚡ 55 خشب
🪨⃝⚡ 25 حجر
🔩⃝⚡ 35 حديد

⚔️⃝⚡ *مـتـطـلـبـات صـنـع سـيـف:*
🪵⃝⚡ 45 خشب
🔩⃝⚡ 95 حديد

🎣⃝⚡ *مـتـطـلـبـات صـنـع صـنـارة:*
🪵⃝⚡ 95 خشب
🔩⃝⚡ 25 حديد
🕸️⃝⚡ 35 خيط

🛡️⃝⚡ *مـتـطـلـبـات صـنـع درع:*
🔩⃝⚡ 95 حديد
✧⃝⚡ 12 زمرد
💎⃝⚡ 15 الماس

💳⃝⚡ *مـتـطـلـبـات صـنـع بـطـاقـة:*
✧⃝⚡ 10 زمرد
💎⃝⚡ 15 الماس
🪙⃝⚡ 50k ذهب
💰⃝⚡ 50k نقود

 ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙
⌬──══─┈•⤣⚡⤤•┈─══──⌬`

  try {
    if (/craft|صناعة|صنع/i.test(command)) {
      switch (type) {
        case 'معول':
          if (user.pickaxe > 0) return m.reply('❌⃝❄ لـديـك مـعـول بـالـفـعـل ⛏️⃝⚡')
          if (user.rock < 25 || user.wood < 55 || user.iron < 35) {
            return m.reply(`❌⃝❄ *لا تـوجـد سـلـع كـافـيـة*\n\n📋⃝⚡ *لـصـنـع مـعـول تـحـتـاج:*\n🪵⃝⚡ 55 خـشـب\n🔩⃝⚡ 35 حـديـد\n🪨⃝⚡ 25 حـجـر`)
          }
          user.wood -= 55
          user.iron -= 35
          user.rock -= 25
          user.pickaxe += 1
          user.pickaxedurability = 40
          m.reply('✅ *نـجـحـت فـي صـنـع مـعـول* ⛏️⃝⚡\n\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙')
          break
          
        case 'سيف':
          if (user.sword > 0) return m.reply('❌⃝❄ *لـديـك سـيـف بـالـفـعـل* 🗡️⃝⚡')
          if (user.wood < 45 || user.iron < 95) {
            return m.reply(`❌⃝❄ *لا تـوجـد سـلـع كـافـيـة*\n\n📋⃝⚡ *لـصـنـع سـيـف تـحـتـاج:*\n🪵⃝⚡ 45 خـشـب\n🔩⃝⚡ 95 حـديـد`)
          }
          user.wood -= 45
          user.iron -= 95
          user.sword += 1
          user.sworddurability = 40
          m.reply('✅ *نـجـحـت فـي صـنـع سـيـف* 🗡️⃝⚡\n\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙')
          break
          
        case 'صنارة':
          if (user.fishingrod > 0) return m.reply('❌⃝❄ *لـديـك صـنـارة بـالـفـعـل* 🎣⃝⚡')
          if (user.wood < 95 || user.iron < 25 || user.string < 35) {
            return m.reply(`❌⃝❄ *لا تـوجـد سـلـع كـافـيـة*\n\n📋⃝⚡ *لـصـنـع صـنـارة تـحـتـاج:*\n🪵⃝⚡ 95 خـشـب\n🔩⃝⚡ 25 حـديـد\n🕸️⃝⚡ 35 خـيـط`)
          }
          user.wood -= 95
          user.iron -= 25
          user.string -= 35
          user.fishingrod += 1
          user.fishingroddurability = 40
          m.reply('✅ *نـجـحـت فـي صـنـع صـنـارة* 🎣⃝⚡\n\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙')
          break
          
        case 'درع':
          if (user.armor > 0) return m.reply('❌⃝❄ *لـديـك درع بـالـفـعـل* 🛡️⃝⚡')
          if (user.iron < 95 || user.emerald < 12 || user.diamond < 15) {
            return m.reply(`❌⃝❄ *لا تـوجـد سـلـع كـافـيـة*\n\n📋⃝⚡ *لـصـنـع درع تـحـتـاج:*\n🔩⃝⚡ 95 حـديـد\n✧⃝⚡ 12 زمـرد\n💎⃝⚡ 15 الـمـاس`)
          }
          user.emerald -= 12
          user.iron -= 95
          user.diamond -= 15
          user.armor += 1
          user.armordurability = 50
          m.reply('✅ *نـجـحـت فـي صـنـع درع* 🛡️⃝⚡\n\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙')
          break
          
        case 'بطاقة':
          if (user.atm > 0) return m.reply('❌⃝❄ *لـديـك بـطـاقـة بـالـفـعـل* 💳⃝⚡')
          if (user.emerald < 10 || user.money < 50000 || user.joincount < 50000 || user.diamond < 5) {
            return m.reply(`❌⃝❄ *لا تـوجـد سـلـع كـافـيـة*\n\n📋⃝⚡ *لـصـنـع بـطـاقـة تـحـتـاج:*\n💲⃝⚡ 50000 نـقـود\n✧⃝⚡ 10 زمـرد\n🪙⃝⚡ 50000 ذهـب\n💎⃝⚡ 5 الـمـاس`)
          }
          user.emerald -= 10
          user.money -= 50000
          user.joincount -= 50000
          user.diamond -= 5
          user.atm += 1
          m.reply('✅ *نـجـحـت فـي صـنـع بـطـاقـة* 💳⃝⚡\n\n ִᗀᩙᰰ ̼𝆬🌙̸ ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙')
          break
          
        default:
          return m.reply(caption)
      }
    }
  } catch (e) {
    console.log(e)
    m.reply('❌⃝❄ *عـذراً، حـدث خـطـأ أثـنـاء الـتـصـنـيـع*')
  }
}

handler.help = ['صنع ⃝⚡', 'صناعة ⃝⚡']
handler.tags = ['rpg ⃝🌙']
handler.command = /^(craft|صناعة|صنع)$/i
handler.group = true

export default handler
