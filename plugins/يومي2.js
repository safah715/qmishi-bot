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
  pet: '🪽‣ حــيــوان',
  petFood: '🍖‣ لــحــم',
  joincount: '🪙‣ ذهــــب',
  uncommon: '📦‣ شــائــع',
  common: '📦‣ نــادر',
  legendary: '📦‣ اســطــوري',
  mythic: '📦‣ خــرافــي',
};

const rewards = {
   exp: 35999,
   money: 45000,
   trash: 15000,
   common: 12,
   uncommon: 14,
   };
const cooldown = 86400000;

let handler = async (m, { conn, usedPrefix, isPrems }) => {
  let more = String.fromCharCode(8206);
  let done = '🥉';
  m.react(done);
  let user = global.db.data.users[m.sender];
  let time = user.lastclaim + cooldown;
  if (new Date() - user.lastclaim < cooldown) throw `*لــقــد قــمــت بــالــفــعــل بــالمــطــالــبــة بــالــمــكــافــأة الــيــومــيــة🥉،*\n*انــتــظــر ❗*\n*🕒${msToTime(time - new Date())}*`;

  let text = ''; // Move the declaration here
  function getArabicRewards(userRewards) {
    for (let reward of Object.keys(userRewards)) {
      if (!(reward in itemMapping)) continue;
      user[reward] += rewards[reward];
      text += ` *${itemMapping[reward]} | +${userRewards[reward]}*\n`;
    }
    return text;
  }
m.reply(`> *🥉 الــمــكــافــأة الــيــومــيــة╿↶*
> *🎁 لــقــد تــلــقــيــت╿↶*\n${getArabicRewards(rewards)}`);

user.lastclaim = new Date() * 1;
};

handler.help = ['مكافأة','daily','claim','يومي'];
handler.tags = ['xp'];
handler.command = /^(يومي2|مكافأة|daily|claim)$/i;

handler.cooldown = cooldown;
export default handler;

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ' ســاعــة و ' + minutes + ' دقــائــق';
}