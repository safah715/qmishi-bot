/* تـم الـتـنـسـيـق بـحـسـب طـلـب الـمـطـور: ʀɪʏᴀᴅ 🍁 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.math = conn.math ? conn.math : {}
    
    // 1. تـحـديـد الـصـعـوبـة 🛠️⃝⚡
    if (args.length < 1) {
        await m.react('⚡')
        throw `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
              `🧮⃝⚡ *تـحـدي الـريـاضـيـات:* \n\n` +
              `> 💡 الـصـعـوبـات الـمـتـاحـة:\n` +
              `*${Object.keys(modes).join(' | ')}*\n\n` +
              `📌 مـثـال: *${usedPrefix + command} عادي*\n\n` +
              `⌬──══─┈•⤣⚡⤤•┈─══──⌬`
    }

    let mode = args[0].toLowerCase()
    if (!(mode in modes)) throw `⚠️⃝⚡ الـصـعـوبـة مـفـقـودة! اخـتـر مـن الـقـائـمـة أعـلاه.`

    let id = m.chat
    if (id in conn.math) return conn.reply(m.chat, '⏳⃝⚡ *لـا تـزال هـنـاك مـسـألـة لـم تُـحـل بـعـد!*', conn.math[id][0])

    // 2. تـولـيـد الـمـسـألـة ✅
    let math = genMath(mode)
    let caption = `⌬──══─┈•⤣⚡⤤•┈─══──⌬\n\n` +
                  `🧮⃝⚡ *أوجـد الـنـاتـج:* \n\n` +
                  `> 🧩 الـعـمـلـيـة: *${math.str} = ?*\n\n` +
                  `⏰ *الـوقـت:* ${(math.time / 1000).toFixed(0)} ثـانـيـة\n` +
                  `🎁 *الـجـائـزة:* ${math.bonus} XP\n\n` +
                  `⚡ *قـم بـالـرد عـلـى هـذه الـرسـالـة بـالـإجـابـة.*\n\n` +
                  `⌬──══─┈•⤣⚡⤤•┈─══──⌬`

    await m.react('⏳⃝⚡')
    conn.math[id] = [
        await conn.reply(m.chat, caption, m),
        math, 4, // 4 محاولات لكل مستخدم
        setTimeout(() => {
            if (conn.math[id]) {
                conn.reply(m.chat, `⏰⃝⚡ *انـتـهـى الـوقـت!* \n> الـإجـابـة الـصـحـيـحـة: *${math.result}*`, conn.math[id][0])
                delete conn.math[id]
            }
        }, math.time)
    ]
}

handler.help = ['رياضيات ⃝⚡']
handler.tags = ['game ⃝🌙']
handler.command = /^(رياضيات|الرياضيات|math|maths)$/i

// ⚙️ إعـدادات الـمـسـتـويـات 📅⃝⚡
let modes = {
  مبتدئ: [-3, 3, -3, 3, '+-', 15000, 10],
  سهل: [-10, 10, -10, 10, '*/+-', 20000, 40],
  عادي: [-40, 40, -20, 20, '*/+-', 40000, 150],
  صعب: [-100, 100, -70, 70, '*/+-', 60000, 350],
  أقصى: [-999, 999, -999, 999, '*/', 60000, 999],
  مستحيل: [-999999, 999999, -999999, 999999, '*/', 30000, 35000]
}

let operators = { '+': '+', '-': '-', '*': '×', '/': '÷' }

function genMath(mode) {
    let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
    let a = randomInt(a1, a2)
    let b = randomInt(b1, b2)
    let op = pickRandom([...ops])
    let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
    if (op == '/') [a, result] = [result, a]
    return { str: `${a} ${operators[op]} ${b}`, mode, time, bonus, result }
}

function randomInt(from, to) {
    if (from > to) [from, to] = [to, from]
    return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

export default handler
