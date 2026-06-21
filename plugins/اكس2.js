import { format } from 'util'
let debugMode = !1
let winScore = 4999
let playScore = 99

export async function before(m) {
    let ok
    let isWin = !1
    let isTie = !1
    let isSurrender = !1
    this.game = this.game ? this.game : {}
    let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')

    if (room) {
        if (!/^([1-9]|(me)?nyerah|انسحب|استسلم|استسلام)$/i.test(m.text)) 
            return !0
        
        isSurrender = !/^[1-9]$/.test(m.text)
        if (m.sender !== room.game.currentTurn) { 
            if (!isSurrender) return !0 
        }

        if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
            m.reply({
                '-3': 'اللعبة انتهت بالفعل',
                '-2': 'رقم غير صالح',
                '-1': 'المكان مشغول',
                0: 'المكان مشغول',
            }[ok])
            return !0 
        }

        if (m.sender === room.game.winner) isWin = true
        else if (room.game.board === 511) isTie = true

        let arr = room.game.render().map(v => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
            }[v]
        })

        if (isSurrender) {
            room.game._currentTurn = m.sender === room.game.playerX
            isWin = true 
        }

        let winner = isSurrender ? room.game.currentTurn : room.game.winner
        
        // التنسيق المتموج الجديد
        let footer = (isWin || isTie) ? `\n\n ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  𝗠𝗔𝗦𝗛 𝗕𝗢𝗧 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙` : ''
        
        let str = `*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❎ :* @${room.game.playerX.split('@')[0]}
*⃝🌙┆⭕ :* @${room.game.playerO.split('@')[0]}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${isWin ? `*⃝⚡┆🏆 الفائز:* @${winner.split('@')[0]}\n*⃝🌙┆مبارك لقد ربحت ${winScore} نقطة!*` : isTie ? `*⃝⚡┆🤝 النتيجة: تعادل*\n*⃝🌙┆حظاً أوفر لكما المرة القادمة!*` : `*⃝⚡┆الدور على:* @${room.game.currentTurn.split('@')[0]}\n*⃝🌙┆اكتب رقم المربع للعب أو 'انسحب'*`}
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*${footer}`.trim()

        let users = global.db.data.users
        if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
            room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat

        if (room.x !== room.o)
            await this.sendMessage(room.x, { text: str, mentions: this.parseMention(str)}, { quoted: m })
        await this.sendMessage(room.o, { text: str, mentions: this.parseMention(str)}, { quoted: m })

        if (isTie || isWin) {
            users[room.game.playerX].exp += playScore
            users[room.game.playerO].exp += playScore
            if (isWin) users[winner].exp += winScore - playScore
            delete this.game[room.id]
        }
    }
    return !0 
}
