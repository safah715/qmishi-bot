import chalk from 'chalk'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { existsSync, promises as fs, readdirSync, rmSync, unlinkSync } from 'fs'
import path from 'path'

// نــصــوص الــزخــرفــة والــتــنــســيــق
let rtxWelcome = `
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*`

let rtxBye = `
*⌬──══─┈•⤣⚡⤤•┈─══──⌬*`

// دالة للحصول على الصورة المناسبة (صورة الشخص أو صورة المجموعة)
async function getProfileImage(conn, participantId, groupId) {
    try {
        // محاولة جلب صورة الشخص
        const userPP = await conn.profilePictureUrl(participantId, 'image')
        return userPP
    } catch (userError) {
        try {
            // إذا لم توجد صورة للشخص، جلب صورة المجموعة
            const groupPP = await conn.profilePictureUrl(groupId, 'image')
            return groupPP
        } catch (groupError) {
            // إذا لم توجد صورة للمجموعة، استخدام الصورة الافتراضية
            return 'https://files.catbox.moe/31gcnr.jpg'
        }
    }
}

let handler = (m) => m
handler.before = async function (m, {conn, participants, groupMetadata, isBotAdmin}) {
    // التحقق من وجود الخصائص المطلوبة
    if (!m.isGroup) return
    
    // الحصول على إعدادات المجموعة من التخزين المحلي
    const chatId = m.chat
    const chat = global.db?.data?.chats?.[chatId] || {}
    
    // إذا كان الترحيب معطل، لا تفعل شيء
    if (!chat.welcome) return
    
    // التحقق من وجود messageStubType
    if (m.messageStubType === undefined) return
    
    // الحصول على معرف العضو الجديد/المغادر
    let participantId = m.messageStubParameters?.[0] || m.sender
    let usuario = `@${participantId.split('@')[0]}`
    
    // الحصول على الصورة المناسبة (صورة الشخص أو المجموعة)
    let pp = await getProfileImage(conn, participantId, m.chat)
    let img = await (await fetch(pp)).buffer()
    
    let users = participants.map((u) => conn.decodeJid(u.id))
    const groupAdmins = participants.filter((p) => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')

    // تــرحــيــب بــالــعــضــو الــجــديــد
    // WAMessageStubType = 27 = GroupParticipantAdd
    if (m.messageStubType == 27) {
        let subject = groupMetadata.subject || 'المجموعة'
        let descs = groupMetadata.desc || '۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ⃝𝗠𝗔𝗦𝗛 𝗕𝗢𝗧َ 𝅄 ۫ ִᗀᩙᰰ ̼𝆬🌙 '
        let userName = participantId.split('@')[0]

        let defaultWelcome = `${rtxWelcome.trim()}\n\n`
        defaultWelcome += `*⃝⚡┆👤 مــرحــبــًا @${userName}*\n`
        defaultWelcome += `*⃝🌙┆📋 أهــلاً وســهــلاً بــك فــي مــجــمــوعــة:*\n`
        defaultWelcome += `*⃝⚡┆📍 ${subject}*\n\n`
        defaultWelcome += `*⃝🌙┆📝 وصــف الــمــجــمــوعــة:*\n`
        defaultWelcome += `*⃝⚡┆💬 ${descs}*\n`
        defaultWelcome += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*`

        let textWel = chat.sWelcome
            ? chat.sWelcome
                .replace(/@user/g, `@${userName}`)
                .replace(/@group/g, subject)
                .replace(/@desc/g, descs)
            : defaultWelcome

        await this.sendMessage(
            m.chat,
            {
                text: textWel,
                contextInfo: {
                    forwardingScore: 9999999,
                    isForwarded: true,
                    mentionedJid: [participantId],
                    externalAdReply: {
                        showAdAttribution: true,
                        renderLargerThumbnail: true,
                        thumbnailUrl: pp,
                        title: '🌟 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ⃝𝗠𝗔𝗦𝗛 𝗕𝗢𝗧َ',
                        containsAutoReply: true,
                        mediaType: 1,
                        sourceUrl: 'https://whatsapp.com/channel/0029VbD9P2TISTkKDuadWm2P'
                    }
                }
            },
            { quoted: null }
        )
        return
    }

    // رســالــة الــمــغــادر
    // WAMessageStubType = 28 = GroupParticipantRemove
    // WAMessageStubType = 32 = GroupParticipantRemove (طرد)
    if (m.messageStubType == 28 || m.messageStubType == 32) {
        let subject = groupMetadata.subject || 'المجموعة'
        let userName = participantId.split('@')[0]

        let defaultBye = `${rtxBye.trim()}\n\n`
        defaultBye += `*⃝⚡┆👤 @${userName}*\n`
        defaultBye += `*⃝🌙┆😢 غــادر الــمــجــمــوعــة*\n`
        defaultBye += `*⃝⚡┆📍 ${subject}*\n`
        defaultBye += `*⌬──══─┈•⤣⚡⤤•┈─══──⌬*`

        let textBye = chat.sBye 
            ? chat.sBye
                .replace(/@user/g, `@${userName}`)
                .replace(/@group/g, subject)
            : defaultBye

        await this.sendMessage(
            m.chat,
            {
                text: textBye,
                contextInfo: {
                    forwardingScore: 9999999,
                    isForwarded: true,
                    mentionedJid: [participantId],
                    externalAdReply: {
                        showAdAttribution: true,
                        renderLargerThumbnail: true,
                        thumbnailUrl: pp,
                        title: '🌟 ۫ ִᗀᩙᰰ ̼𝆬🌙̸〫 ᮭ࣪࣪ ⸼۫  ⃝𝗠𝗔𝗦𝗛 𝗕𝗢𝗧َ',
                        containsAutoReply: true,
                        mediaType: 1,
                        sourceUrl: 'https://whatsapp.com/channel/0029VbD9P2TISTkKDuadWm2P'
                    }
                }
            },
            { quoted: null }
        )
        return
    }
}

export default handler