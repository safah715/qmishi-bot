import WebSocket from 'ws'
import axios from 'axios'

class Copilot {
    constructor() {
        this.conversationId = null
        this.headers = {
            origin: 'https://copilot.microsoft.com',
            'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
        }
    }

    async createConversation() {
        let { data } = await axios.post('https://copilot.microsoft.com/c/api/conversations', null, { headers: this.headers })
        this.conversationId = data.id
        return this.conversationId
    }

    async chat(message) {
        if (!this.conversationId) await this.createConversation()
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`wss://copilot.microsoft.com/c/api/chat?api-version=2&features=-,ncedge,edgepagecontext&setflight=-,ncedge,edgepagecontext&ncedge=1`, { headers: this.headers })
            let response = ''
            
            const timeout = setTimeout(() => {
                ws.terminate()
                reject(new Error('TIMEOUT'))
            }, 20000)

            ws.on('open', () => {
                ws.send(JSON.stringify({ 
                    event: 'send', 
                    mode: 'chat', 
                    conversationId: this.conversationId, 
                    content: [{ type: 'text', text: message }], 
                    context: {} 
                }))
            })

            ws.on('message', chunk => {
                try {
                    const parsed = JSON.parse(chunk.toString())
                    if (parsed.event === 'appendText') response += parsed.text || ''
                    if (parsed.event === 'done') {
                        clearTimeout(timeout)
                        resolve(response)
                        ws.close()
                    }
                } catch (e) {}
            })

            ws.on('error', (err) => {
                clearTimeout(timeout)
                reject(err)
            })
        })
    }
}

let handler = async (m, { conn, text }) => {
    try {
        if (!text) return m.reply('*مثال: .جبتي ما هو الفضاء؟* ⚡')

        let copilot = new Copilot()
        let res = await copilot.chat(text)

        const thumbnail = await (await axios.get('https://files.catbox.moe/o98u8r.jpg', { responseType: 'arraybuffer' })).data
        
        await conn.sendMessage(m.chat, {
            text: res.trim(),
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: "🧠⃝⚡ نينو بوت - الاصطناعي الذكاء",
                    body: "© ʙʏ ʀɪʏᴀᴅ",
                    mediaType: 1, 
                    renderLargerThumbnail: true,
                    thumbnail: thumbnail,
                    sourceUrl: 'https://copilot.microsoft.com'
                }
            }
        }, { quoted: m })

    } catch (e) {
        m.reply(`⚠️⃝⚡ Error: ${e.message}`)
    }
}

handler.help = ['جبتي ⃝⚡']
handler.command = ['جبتي']
handler.tags = ['ia ⃝🌙']

export default handler
