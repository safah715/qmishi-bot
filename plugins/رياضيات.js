/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

let handler = m => m

handler.before = async function (m) {
  // 1. تـأكـد أن الـرسـالـة نـصـيـة ⚡
  if (!m.text) return !0

  // 2. تـنـظـيـف الـنـص وتـحـويـل الـأرقـام الـعـربـيـة إلـى إنـجـلـيـزيـة
  const cleanText = m.text.trim().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  
  // الـتأكـد أن الـمـدخل رقـم صـحـيـح
  if (!/^-?\d+(\.\d+)?$/.test(cleanText)) return !0

  const id = m.chat
  this.math = this.math || {}

  // 3. الـتـأكـد مـن وجـود مـسـابـقـة نـشـطـة ⏳⃝⚡
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.text) return !0
  const quotedText = m.quoted.text.toLowerCase()
  if (!quotedText.includes('احسب')) return !0

  if (!(id in this.math)) return !0 // لا تـرسل رد إذا لم تـكن هناك مـسابـقة

  // 4. الـتـحـقـق مـن ربـط الـرد بـالـسـؤال الـحـالـي ✅
  const current = this.math[id]
  if (!current || !current[0] || m.quoted.id !== current[0].id) return !0

  let math = JSON.parse(JSON.stringify(current[1]))

  // 5. مـقـارنـة الـإجـابـة ⚖️⃝⚡
  const isCorrect = Number(cleanText) === Number(math.result)

  if (isCorrect) {
    // 🥳 إجـابـة صـحـيـحـة
    global.db.data.users[m.sender].exp += math.bonus
    clearTimeout(current[3])
    delete this.math[id]
    
    await m.react('✅')
    return m.reply(
`⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
`✅ *إجـابـة صـحـيـحـة يـا بـطـل!* \n\n` +
`> 🎉 *الـجـائـزة:* +${math.bonus} XP\n` +
`> 👤 *الـفـائـز:* @${m.sender.split('@')[0]}\n\n` +
`⌬──══─┈•⤣⚡⤤•┈─══──⌬`, null, { mentions: [m.sender] })

  } else {
    // ❌ إجـابـة خـاطـئـة
    if (--current[2] <= 0) {
      clearTimeout(current[3])
      delete this.math[id]
      await m.react('⏰⃝⚡')
      return m.reply(`⚠️⃝⚡ *انـتـهـت الـمـحـاولات!* \n> الـإجـابـة الـصـحـيـحـة كـانـت: *${math.result}*`)
    } else {
      await m.react('❎⃝⚡')
      return m.reply(`❌ *إجـابـة خـاطـئـة!*\n> تـبـقـى لـك (${current[2]}) مـحـاولـة فـقـط.`)
    }
  }
}

export default handler
