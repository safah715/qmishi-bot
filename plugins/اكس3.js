const handler = async (m, { conn, usedPrefix }) => {
  try {

    if (!conn.game) conn.game = {}

    let room = Object.values(conn.game).find(r =>
      r.id?.startsWith('tictactoe') &&
      r.game &&
      (r.game.playerX === m.sender || r.game.playerO === m.sender)
    )

    if (!room) {
      return m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆❌ لـسـت داخـل أي لـعـبـة إكـس أو*
*⃝🌙┆💡 لإنشاء لعبة اكتب: ${usedPrefix}اكس_او*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*`
      )
    }

    delete conn.game[room.id]

    await m.reply(
`*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
*⃝⚡┆✔ تـم إنـهـاء الـمـباراة بـنـجـاح*
*⃝🌙┆🏳️ لـقـد انـسـحـبـت مـن الـلـعـبـة*
*꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ꒷꒦꒷꒦꒷꒷꒷꒦꒷*
`
    )

  } catch (e) {
    console.error(e)
    m.reply("❌ حدث خطأ أثناء تنفيذ الأمر")
  }
}

handler.command = /^(delttt|استسلم|deltt|انسحب|كنسل)$/i
export default handler