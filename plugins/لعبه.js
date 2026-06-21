import db from '../lib/database.js'
let cooldowns = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {

  let more = String.fromCharCode(8206);
  let done = '🎮';
  m.react(done);

    let poin = 9999
    let reseqv = `*┌─⊷「❏ اخـــتـــار 🎮」⊶*\n*حــجــر🪨/ورق🧻/مــقــص✂*\n*▢〉📌‣ مــثــال :↶*\n*.لــعــبــة ورق*\n*└──────────────⊷*`
    if (!text) throw reseqv
    var astro = Math.random()
    if (astro < 0.34) {
        astro = 'حجر'
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'مقص'
    } else {
        astro = 'ورق'
    }
    if (cooldowns[m.sender] && cooldowns[m.sender] > Date.now()) {
        let remainingTime = Math.ceil((cooldowns[m.sender] - Date.now()) / 10000);
        throw `*⏳ انــتــظــر ${remainingTime} ثــوانــي لاســتــخــدام هــذا الأمــر مــرة أخــرى*`;
    }

    if (text == astro) {
      global.db.data.users[m.sender].credit += 999
        m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉❥‣ الــتــعــادل*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n *🎁 نــقــاط (±)999 ذهـــب 🪙*\n*└──────────────⊷*`)
    } else if (text == 'حجر') {
        if (astro == 'مقص') {
            global.db.data.users[m.sender].credit += 9999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🎊‣ فـــائـــز 🥳*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n *🎁 نــقــاط +${poin} ذهـــب 🪙*\n*└──────────────⊷*`)
        } else {
          global.db.data.users[m.sender].credit -= 2999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🪦‣ لــقــد خـــســـرت 😔*\n*‣ انـــت :* ${text}\n*‣ 𝐷𝐼𝐴𝐵𝐿𝑂᯽𝐵𝑂𝑇 :* ${astro}\n *نــقــاط -2999 ذهـــب 🪙*\n*└──────────────⊷*`)
        }
    } else if (text == 'مقص') {
        if (astro == 'ورق') {
            global.db.data.users[m.sender].credit += 9999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🎊‣ فـــائـــز 🥳*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n *🎁 نــقــاط +${poin} ذهـــب 🪙*\n*└──────────────⊷*`)
        } else {
          global.db.data.users[m.sender].credit -= 2999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🪦‣ لــقــد خـــســـرت 😔*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n\ *نــقــاط -2999 ذهـــب 🪙*\n*└──────────────⊷*`)
        }
    } else if (text == 'ورق') {
        if (astro == 'حجر') {
            global.db.data.users[m.sender].credit += 9999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🎊‣ فـــائـــز 🥳*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n *🎁 نـــقـــاط +${poin} ذهـــب 🪙*\n*└──────────────⊷*`)
        } else {
          global.db.data.users[m.sender].credit -= 2999
            m.reply(`*┌─⊷「❏ الـــنـتــيــجــة 💯」⊶*\n*┌───⊷*\n*▢〉🪦‣ لــقــد خـــســـرت 😔*\n*‣ انـــت :* ${text}\n*‣ ديــابــلو :* ${astro}\n *نــقاــط -2999 ذهـــب 🪙*\n*└──────────────⊷*`)
        }
    } else {
        throw reseqv
    }
  cooldowns[m.sender] = Date.now() + 10000; // 10 seconds cooldown
}
handler.help = ['ppt','لعبة',]
handler.tags = ['game']
handler.command = ['لعبة','لعبه'] 
handler.register = false
handler.level = 10

export default handler