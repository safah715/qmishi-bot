import similarity from 'similarity'
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !/^/i.test(m.quoted.text)) return !0
    this.tekateki = this.tekateki ? this.tekateki : {}
    if (!(id in this.tekateki)) return
    if (m.quoted.id == this.tekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
        if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tekateki[id][2]
            m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🎉 الاجابه صحيحه يلا جرب تاني*
*⃝🌙┆🏆 النقاط ↜ ${this.tekateki[id][2]}*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
            clearTimeout(this.tekateki[id][3])
            delete this.tekateki[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
            m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆🔥 اقـتـربـت مـن الاجـابـه*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
        } else {
            m.reply(`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ الاجـابـه غـلـط*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`)
        }
    }
    return !0
}

handler.exp = 0

export default handler