// إزالة الاستيراد من postgres.js
// سنستخدم متغيرات محلية بدلاً من قاعدة البيانات

// نــصــوص الــزخــرفــة والــتــنــســيــق
let rtxMenu = `
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*
*⃝⚡┆⚙️ قــائــمــة الإعــدادات*
*⃝🍸┆📋 الإعــدادات الــمــتــاحــة*
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`

let rtxSuccess = `
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*
*⃝⚡┆✅ تــم تــنــفــيــذ الأمــر بــنــجــاح*
*⃝🍸┆📊 تــفــاصــيــل الــتــعــديــل*
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`

let rtxError = `
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*
*⃝⚡┆⚠️ خــطــأ فــي تــنــفــيــذ الأمــر*
*⃝🍸┆🔧 تــحــقــق مــن الــصــيــغــة*
*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`

// كائن لحفظ إعدادات المجموعات محلياً
const groupSettings = new Map();

// كائن لحفظ إعدادات البوتات الفرعية محلياً
const subbotSettings = new Map();

// دالة للحصول على إعدادات المجموعة
function getGroupSetting(chatId) {
    if (!groupSettings.has(chatId)) {
        groupSettings.set(chatId, {
            welcome: false,
            detect: false,
            antilink: false,
            antilink2: false,
            antiporn: false,
            audios: false,
            antifake: false,
            modohorny: false,
            modoadmin: false
        });
    }
    return groupSettings.get(chatId);
}

// دالة للحصول على إعدادات البوت الفرعي
function getSubbotSetting(botId) {
    const cleanId = botId.replace(/:\d+/, '');
    if (!subbotSettings.has(cleanId)) {
        subbotSettings.set(cleanId, {
            antiPrivate: false,
            antiCall: false
        });
    }
    return subbotSettings.get(cleanId);
}

const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
const isEnable = /true|enable|(turn)?on|1|تفعيل|تشغيل/i.test(command)
const type = (args[0] || '').toLowerCase()
const chatId = m.chat
const botId = conn.user?.id
const cleanId = botId.replace(/:\d+/, '');
const isSubbot = botId !== 'main'
let isAll = false, isUser = false

// الحصول على إعدادات المجموعة
let chat = getGroupSetting(chatId);

const getStatus = (flag) => m.isGroup ? (chat[flag] ? '✅' : '❌') : '⚠️';

let menu = `${rtxMenu.trim()}\n\n`;
menu += `> *اخــتــر أحــد الــخــيــارات مــن الــقــائــمــة*\n> *لــبــدء الــتــكــويــن*\n\n`;
menu += `● *رموز حالة الإعدادات:
✅ ⇢ *الــوظــيــفــة مــفــعــلــة*
❌ ⇢ *الــوظــيــفــة مــعــطــلــة*
⚠️ ⇢ *هــذا الــدردشــة لــيــس مــجــمــوعــة*\n\n`;
menu += `*『 وظــائــف لــلــمــشــرفــيــن 』*\n\n`;
menu += `🎉 الــتــرحــيــب ${getStatus('welcome')}\n• رســالــة الــتــرحــيــب\n• ${usedPrefix + command} welcome\n\n`;
menu += `📣 كــشــف الــتــنــبــيــهــات ${getStatus('detect')}\n• الــتــنــبــيــه بــتــغــيــيــرات الــمــجــمــوعــة\n• ${usedPrefix + command} detect\n\n`;
menu += `🔗 مــنــع الــروابــط ${getStatus('antilink')}\n• كــشــف روابــط الــمــجــمــوعــات\n• ${usedPrefix + command} antilink\n\n`;
menu += `🌐 مــنــع الــروابــط 2 ${getStatus('antilink2')}\n• كــشــف أي رابــط\n• ${usedPrefix + command} antilink2\n\n`;
menu += `🕵️ مــنــع الــارقــام الــمــزيــفــة ${getStatus('antifake')}\n• حــظــر ارقــام مــن دول أخــرى\n• ${usedPrefix + command} antifake\n\n`;
menu += `🔞 NSFW ${getStatus('modohorny')}\n• مــحــتــوى +18 فــي الــمــلــصــقــات/الــصــور\n• ${usedPrefix + command} modohorny\n\n`
menu += `🔒 وضــع الــمــشــرفــيــن فــقــط ${getStatus('modoadmin')}\n• الــمــشــرفــيــن فــقــط يــســتــخــدمــون الأوامــر\n• ${usedPrefix + command} modoadmin\n\n`;
  
menu += `\n*『 وظــائــف لــلــمــالــك 』*\n\n`;
const subbotConfig = getSubbotSetting(botId);
menu += `🚫 مــنــع الــخــاص ${isSubbot ? (subbotConfig.antiPrivate ? '✅' : '❌') : '⚠️'}
• حــظــر الاســتــخــدام فــي الــخــاص
• ${usedPrefix + command} antiprivate\n\n`;
menu += `📵 مــنــع الــمــكــالــمــات ${isSubbot ? (subbotConfig.antiCall ? '✅' : '❌') : '⚠️'}
• حــظــر الــمــكــالــمــات
• ${usedPrefix + command} anticall`;
  
switch (type) {
case 'welcome': case 'bienvenida': case 'ترحيب':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.welcome = isEnable;
break

case 'detect': case 'avisos': case 'تنبيهات':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.detect = isEnable;
break

case 'antilink': case 'antienlace': case 'منع الروابط':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.antilink = isEnable;
break
      
case 'antilink2': case 'منع الروابط2':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.antilink2 = isEnable;
break
            
case 'antiporn': case 'antiporno': case 'antinwfs': case 'منع الاباحية':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.antiporn = isEnable;
break
            
case 'audios': case 'صوتيات':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.audios = isEnable;
break
            
case 'antifake': case 'منع الارقام المزيفة':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.antifake = isEnable;
break
      
case 'nsfw': case "modohorny": case "modocaliente": case "الوضع الاباحي":
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.modohorny = isEnable;
break
      
case 'modoadmin': case 'onlyadmin': case 'وضع المشرفين':
if (!m.isGroup) throw '⚠️ هــذا الأمــر يــعــمــل فــي الــمــجــمــوعــات فــقــط.'
if (!isAdmin) throw "⚠️ فــقــط الــمــشــرفــيــن يــمــكــنــهــم اســتــخــدام هــذا الأمــر.";
chat.modoadmin = isEnable;
break

case 'antiprivate': case 'antiprivado': case 'منع الخاص':
if (!isSubbot && !isOwner) return m.reply('❌ فــقــط الــمــالــك أو الــبــوتــات الــفــرعــيــة يــمــكــنــهــم تــغــيــيــر هــذا.');
const subbotPrivate = getSubbotSetting(botId);
subbotPrivate.antiPrivate = isEnable;
isAll = true;
break;

case 'anticall': case 'antillamada': case 'منع المكالمات':
if (!isSubbot && !isOwner) return m.reply('❌ فــقــط الــمــالــك أو الــبــوتــات الــفــرعــيــة يــمــكــنــهــم تــغــيــيــر هــذا.');
const subbotCall = getSubbotSetting(botId);
subbotCall.antiCall = isEnable;
isAll = true;
break;

default:
return m.reply(menu.trim());
}

let respuesta = `${rtxSuccess.trim()}\n\n`
respuesta += `*⃝⚡┆📋 الــخــيــار:* *${type}*\n`
respuesta += `*⃝🍸┆📍 الــمــســتــوى:* ${isAll ? 'الــبــوت بــأكــمــلــه' : isUser ? 'هــذا الــمــســتــخــدم' : 'هــذه الــمــجــمــوعــة'}\n`
respuesta += `*⃝⚡┆✅ الــحــالــة:* *${isEnable ? 'تــم الــتــفــعــيــل' : 'تــم الــتــعــطــيــل'}* بــنــجــاح\n`
respuesta += `*⌬──══─┈•⤣🌙⤤•┈─══──⌬*`

await m.reply(respuesta)
}

handler.help = ['enable <opción>', 'disable <opción>']
handler.tags = ['nable']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01]|تفعيل|تعطيل|تشغيل|ايقاف)$/i
handler.register = true

export default handler