import fs from 'fs'
import path from 'path'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆📍 الاستخدام الصحيح للأمر:*

*⃝🌙┆${usedPrefix + command} مجلد tmp*
*⃝⚡┆${usedPrefix + command} ملف test.js*
*⃝🌙┆${usedPrefix + command} ملف test.txt مرحبا*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
© ʙʏ ʀɪʏᴀᴅ`.trim())
  }

  const args = text.split(' ')
  const type = args.shift()
  const name = args.shift()
  const content = args.join(' ') || ''

  if (!type || !name) {
    return m.reply('*⃝⚡┆⚠️ عـذراً، يـجب تـحـديـد الـنـوع (مجلد/ملف) والاسـم*')
  }

  const targetPath = path.join(process.cwd(), name)

  try {
    await m.react('🛠️')
    
    // 📁 إنشاء مجلد
    if (type === 'مجلد') {
      if (fs.existsSync(targetPath)) {
        return m.reply('*⃝⚡┆⚠️ الـمـجـلـد مـوجـود مـسـبـقـاً*')
      }
      fs.mkdirSync(targetPath, { recursive: true })
      await m.react('✅')
      return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆✅ تـم إنـشـاء الـمـجـلـد بـنـجـاح*\n*⃝🌙┆الاسـم: ${name}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n© ʙʏ ʀɪʏᴀᴅ`)
    }

    // 📄 إنشاء ملف
    if (type === 'ملف') {
      if (fs.existsSync(targetPath)) {
        return m.reply('*⃝⚡┆⚠️ الـمـلـف مـوجـود مـسـبـقـاً*')
      }
      fs.writeFileSync(targetPath, content || '')
      await m.react('✅')
      return m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n*⃝⚡┆✅ تـم إنـشـاء الـمـلـف بـنـجـاح*\n*⃝🌙┆الاسـم: ${name}*\n*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*\n© ʙʏ ʀɪʏᴀᴅ`)
    }

    return m.reply('*⃝⚡┆❌ نـوع غـيـر مـعـروف (استخدم: مجلد / ملف)*')
  } catch (e) {
    return m.reply('*⃝⚡┆❌ حـدث خـطأ أثـنـاء الإنـشـاء:*\n' + e.message)
  }
}

handler.help = ['انشئ']
handler.tags = ['owner']
handler.command = /^(انشئ)$/i
handler.owner = true

export default handler
