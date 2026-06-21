import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {

    let id = m.chat

    if (!m.quoted || !m.quoted.fromMe || !m.text || !/استخدم.*انسحب/i.test(m.quoted.text) || /.*hhint/i.test(m.text))
        return !0

    this.tebakbendera = this.tebakbendera ? this.tebakbendera : {}

    if (!(id in this.tebakbendera))
        return this.reply(m.chat,
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🌟 تـــحـــدي الـــأذڪـــاء 🌟*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⏳ الــســؤال انــتــهــى مــن قــبــل*
*🎮 انــتــظــر جــولــة جــديــدة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m)

    if (m.quoted.id == this.tebakbendera[id][0].id) {

        let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)

        if (isSurrender) {
            clearTimeout(this.tebakbendera[id][3])
            delete this.tebakbendera[id]

            return this.reply(m.chat,
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🏳️ انــســحــبــت مــن الــتــحــدي*
*⃝🌙┆💭 كــان مــمــكــن تــفــوزهــا*
*⃝⚡┆🔥 حــاول مــرة أخــرى*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m)
        }

        let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]))

        if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {

            global.db.data.users[m.sender].exp += this.tebakbendera[id][2]

            this.reply(m.chat,
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎉 إ جــا بــة صــحــيــحــة 🎉*
*⃝🌙┆🏆 الــجــائــزة ⇇ ${this.tebakbendera[id][2]} نــقــاط*
*⃝⚡┆✨ اســتــمــر يــا بــطــل*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m)

            clearTimeout(this.tebakbendera[id][3])
            delete this.tebakbendera[id]

        } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold)

            m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🔥 قــرّبــت جــدًا مــن الإ جــا بــة*
*⃝🌙┆💡 حــاول مــرة ثــانــيــة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)

        else

            this.reply(m.chat,
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ إ جــا بــة خــاطــئــة*
*⃝🌙┆😅 لا تــســتــســلــم*
*⃝⚡┆🎯 جــرب مــرة أخــرى*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`, m)
    }

    return !0
}

export const exp = 0