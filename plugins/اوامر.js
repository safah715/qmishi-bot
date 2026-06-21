import { existsSync } from 'fs'
import { join } from 'path'
import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // حساب البنج
    let old = performance.now()
    let neww = performance.now()
    let speed = (neww - old).toFixed(4)

    // معلومات المستخدم
    const user = await conn.getName(m.sender)
    const fecha = new Date().toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const hora = new Date().toLocaleTimeString('ar-SA')

    // نص القائمة الرئيسية
let menuText = `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n`
menuText += `*┃ 👤 الــمــســتــخــدم*\n`
menuText += `*┃ 🪪 الــاســم:* ${user}\n`
menuText += `*┃ 📲 الــرقــم:* ${m.sender.split('@')[0]}\n`
menuText += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n\n`

menuText += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n`
menuText += `*┃ ⏱️ الــحــالــة*\n`
menuText += `*┃ 🔌 الــبــيــنــق:* ${speed}ms\n`
menuText += `*┃ ⏳ الــتــشــغــيــل:* ${await getUptime()}\n`
menuText += `*┃ 📅 الــتــاريــخ:* ${fecha}\n`
menuText += `*┃ ⏰ الــوقــت:* ${hora}\n`
menuText += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n\n`

menuText += `*⌬──══─┈•⤣🪐⤤•┈─══──⌬*\n`
menuText += `*┃ 𝐎𝐰𝐧𝐞𝐫: 𝐑𝐢𝐲𝐚𝐝*\n`
menuText += `*⌬──══─┈•⤣🪐⤤•┈─══──⌬*\n\n`

menuText += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n`
menuText += `*〔 مــرحــبــاً بــك فــي بــوت مــاش 💪 〕*\n`
menuText += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*\n`

    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

    const localImagePath = join(process.cwd(), 'Menu.jpg')
    const channel = 'https://whatsapp.com/channel/0029Vb7O26W8V0tu5ErixM1d'
    const developerNumber = '201021902759'
    const developerContact = `https://wa.me/${developerNumber}`
    
    // === إنشاء nativeFlowPayload ===
    const nativeFlowPayload = {
      body: { text: menuText },
      footer: { text: '◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧' },
      nativeFlowMessage: {
        buttons: [
          // الزر الرئيسي: الأقسام
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: "📂 الأقسام الرئيسية",
              sections: [
                {
                  title: "⌬──══─┈•⤣🌙⤤•┈─══──⌬\n║  اختر القسم المطلوب  ║\n⌬──══─┈•⤣🌙⤤•┈─══──⌬",
                  rows: [
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🏅 قــســم الــاداريــة ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق1"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🎨 قــســم الــاســتــيــكــر ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق2"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🎮 قــســم الــالــعــاب ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق3"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🔍 قــســم الــبــحــث و الــتــحــمــيــل ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق4"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🧰 قــســم الــادوات ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق5"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "📦 قــســم الــمــوارد ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق6"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🤖 قــســم الــذكــاء الــاصــطــنــاعــي ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق7"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🎌 قــســم الــنــقــابــات ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق8"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "🖼️ قــســم الــصــور ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق9"
},
{
  "title": "⌬──══─┈•⤣🪐⤤•┈─══──⌬",
  "description": "⛄ قــســم الــتــســلــيــه ◌𝗠𝗔𝗦𝗛 𝗕𝗢𝗧",
  "id": ".ق10"
}
                  ]
                }
              ],
              has_multiple_buttons: true
            })
          },
          // زر نسخ رقم المطور
          {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'تنــصيب 𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 ⭐',
            id: '.تنصيب'
          })
          },
          // زر القناة الرسمية
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: "📢 القناة الرسمية",
              url: channel,
              merchant_url: channel
            })
          },
          // زر التواصل مع المطور
          {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: '👑 التواصل مع المطور',
              url: developerContact,
              merchant_url: developerContact
            })
          }
        ],
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: `⚡ ${speed}ms`,
            url: developerContact,
            copy_code: `المطور: +${developerNumber}`,
            expiration_time: Date.now() + 86400000
          },
          bottom_sheet: {
            in_thread_buttons_limit: 1,
            divider_indices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999],
            list_title: "📂 قائمة أقسام البوت",
            button_title: "⭐ عرض الأقسام ⭐"
          },
          tap_target_configuration: {
            description: "ابدأ الآن مع مــاش بــوت",
            canonical_url: developerContact,
            domain: "https://ryzobot.vercel.app",
            button_index: 0
          }
        })
      }
    }
// دالة للاقتباس الخاص
    // إضافة header إذا كان هناك صورة
    if (existsSync(localImagePath)) {
      try {
        const media = await prepareWAMessageMedia({ image: { url: localImagePath } }, { upload: conn.waUploadToServer })
        nativeFlowPayload.header = {
          hasMediaAttachment: true,
          subtitle: 'بوت متعدد الوظائف',
          imageMessage: media.imageMessage
        }
      } catch (e) {
        console.error('خطأ في الصورة:', e)
        nativeFlowPayload.header = { 
          hasMediaAttachment: false,
          subtitle: 'بوت متعدد الوظائف'
        }
      }
    } else {
      nativeFlowPayload.header = { 
        hasMediaAttachment: false,
        subtitle: 'بوت متعدد الوظائف'
      }
    }

    // إرسال الرسالة التفاعلية
    const interactiveMessage = proto.Message.InteractiveMessage.fromObject(nativeFlowPayload)
    const fkontak = await makeFkontak()
    const msg = generateWAMessageFromContent(m.chat, { interactiveMessage }, { 
      userJid: conn.user.jid, 
      quoted: fkontak 
    })
    
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('خطأ:', e)
    await conn.sendMessage(m.chat, {
      text: `مــاش بــوت\n\n• ${_p}مينيو - القائمة الرئيسية\n• ${_p}بينق - اختبار البوت\n\n⚠️ خطأ في تحميل القائمة`
    }, { quoted: m })
  }
}

// دالة للاقتباس الخاص
async function makeFkontak() {
  try {
    const res = await fetch('https://cdn.russellxz.click/64bba973.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'مــاش بــوت', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined
  }
}

// دالة للحصول على وقت التشغيل
async function getUptime() {
  let totalSeconds = process.uptime()
  let hours = Math.floor(totalSeconds / 3600)
  let minutes = Math.floor((totalSeconds % 3600) / 60)
  let seconds = Math.floor(totalSeconds % 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
handler.help = ['menu', 'مينيو', 'القائمة']
handler.tags = ['main']
handler.command = ['الاوامر', 'menu', 'اوامر', 'القائمة', 'منيو']

export default handler