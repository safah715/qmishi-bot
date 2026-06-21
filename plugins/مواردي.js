let handler = async (m, {conn, usedPrefix}) => {
  let more = String.fromCharCode(8206);
  let done = '💼';
  m.react(done);
  
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]
  
  if (!(who in global.db.data.users)) {
    throw `> \`❌ المستخدم غير موجود\` 👤\n\n` +
          `\`لم يتم العثور على المستخدم في قاعدة البيانات\``;
  }
  
  let items = [
    { icon: '💎', name: 'الــمــاس', value: user.diamond },
    { icon: '✧', name: 'زمــرد', value: user.emerald },
    { icon: '⚙', name: 'فــضــة', value: user.berlian },
    { icon: '🔩', name: 'حــديــد', value: user.iron },
    { icon: '🪨', name: 'حــجــر', value: user.rock },
    { icon: '🕸', name: 'خــيــط', value: user.string },
    { icon: '🪵', name: 'خــشــب', value: user.wood },
    { icon: '🏺', name: 'جــرعــة', value: user.potion },
    { icon: '🗑️', name: 'قــمــامــة', value: user.trash },
    { icon: '🦴', name: 'حــيــوان', value: user.pet },
    { icon: '🍖', name: 'لــحــم', value: user.petFood }
  ];
  
  let itemList = items.map(item => 
    `\`${item.icon} ${item.name}: ${item.value}\``
  ).join('\n');
  
  conn.reply(m.chat,
    `> \`💼 حقيبة الموارد\` 📦\n\n` +
    `\`👤 المستخدم:\` @${who.split('@')[0]}\n\n` +
    `> \`📊 الموارد المتوفرة:\` 🪙\n\n` +
    `${itemList}\n\n` +
    `> \`💡 نصائح:\` 📌\n` +
    `\`استخدم ${usedPrefix}الاوامر\`\n` +
    `\`لعرض جميع الأوامر المتاحة\``,
    m, { mentions: [who] }
  );
}

handler.help = ['balance','رصيد','الرصيد','حقيبه','حقيبة','الحقيبة']
handler.tags = ['econ']
handler.command = ['الرصيد','الحقيبة','حقيبه','مواردي','الشنطة','الشنطه','حقيبة','رصيد','الرصيد','حقيبتي'] 

export default handler;