///https://whatsapp.com/channel/0029Vag9bvrLSmbRE2I5Oj2h

let handler = async (m, {
    conn
}) => {
    conn.bomb = conn.bomb || {};
    let id = m.chat,
        timeout = 180000;
    if (id in conn.bomb) return conn.reply(m.chat, '*^ هناك جلسه لم تنتهي بعد!*', conn.bomb[id][0]);
    const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
    const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const array = bom.map((v, i) => ({
        emot: v,
        number: number[i],
        position: i + 1,
        state: false
    }));
    let teks = `乂  *B O M B*\n\n أرسل الأرقام *1* - *9* لفتح مربع الأرقام *9* أدناه :\n\n`;
    for (let i = 0; i < array.length; i += 3) teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
    teks += `\nTimeout : [ *${((timeout / 1000) / 60)} menit* ]\n إذا حصلت على صندوق يحتوي على قنبلة، سيتم خصم النقاط.`;
    let msg = await conn.reply(m.chat, teks, m);
    let { key } = msg

    let v;
    conn.bomb[id] = [
        msg,
        array,
        setTimeout(() => {
            v = array.find(v => v.emot == '💥');
            if (conn.bomb[id]) conn.reply(m.chat, `*انتهى الوقت!*، القنبلة موجودة في صندوق الأرقام ${v.number}.`, conn.bomb[id][0].key);
            delete conn.bomb[id];
        }, timeout),
        key
    ];

};

handler.help = ["متفجرات"];
handler.tags = ["لعبة"];
handler.command = /^(متفجرات)$/i;

export default handler;