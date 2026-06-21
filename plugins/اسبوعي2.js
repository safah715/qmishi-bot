const itemMapping = {
  money: '💲‣ نــقــود',
  exp: '🆙‣ الــخــبــرة',
  trash: '🗑️‣ قــمــامــة',
  potion: '🏺‣ جــرعــة',
  diamond: '💎‣ الــمــاس',
  wood: '🪵‣  خــشــب',
  rock: '🪨‣  حــجــر',
  string: '🕸‣ خــيــط',
  emerald: ' ✧ ‣  زمــــرد',
  berlian: '⚙‣ فــضــة',
  iron: '🔩‣ حــديــد',
  pet: '🦴‣ حــيــوان',
  petFood: '🍖‣ لــحــم',
  joincount: '🪙‣ ذهــــب',
  uncommon: '📦‣ شــائــع',
  common: '📦‣ نــادر',
  legendary: '📦‣ اســطــوري',
  mythic: '📦‣ خــرافــي',
};

const rewards = {
   exp: 55000,
   money: 25000,
   trash: 9500,
   legendary: 8,
   common: 4,
   uncommon: 8,
};
const cooldown = 604800000;

let handler = async (m, { conn, usedPrefix, isPrems }) => {
  let done = '🥈';
  m.react(done);
  let user = global.db.data.users[m.sender];
  let time = user.lastweekly + cooldown;

  if (new Date() - user.lastweekly < cooldown) return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆لـقـد اسـتـلـمـت الـمـكـافـأة الأسبوعـية بـالـفعل🥈*
*⃝🌙┆انــتــظــر ❗*
*⃝⚡┆🕒 ${msToTime(time - new Date())}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
  );

  let rewardText = ''; 
  for (let reward of Object.keys(rewards)) {
    if (!(reward in itemMapping)) continue;
    user[reward] += rewards[reward];
    rewardText += `*${indexEven(reward) ? '⃝⚡' : '⃝🌙'}┆${itemMapping[reward]} | +${rewards[reward]}*\n`;
  }

  m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🥈 الــمــكــافــأة الأســبــوعــيــة*
*⃝🌙┆🎁 لــقــد تــلــقــيــت:*
${rewardText.trim()}
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
  );

  user.lastweekly = new Date() * 1;
};

handler.help = ['اسبوعي2'];
handler.tags = ['xp'];
handler.command = /^(اسبوعي2|weekly)$/i;

export default handler;

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  return `${days} يوم و ${hours} ساعة و ${minutes} دقيقة`;
}

// دالة بسيطة للتنويع بين الرموز في القائمة
function indexEven(reward) {
  const keys = Object.keys(rewards);
  return keys.indexOf(reward) % 2 === 0;
}
