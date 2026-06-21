import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import zlib from 'zlib';

const NoteGPTGeminiAPI = {
  baseURL: 'https://notegpt.io',
  apiURL: 'https://notegpt.io/api/v2',
  
  generateAnonymousId() {
    return uuidv4();
  },

  generateConversationId() {
    return uuidv4();
  },

  generateGuid() {
    const timestamp = Date.now();
    const random1 = Math.floor(Math.random() * 1000);
    const random2 = Math.floor(Math.random() * 1000000000);
    const encoded = Buffer.from(`${timestamp}|${random1}|${random2}`).toString('base64');
    return encoded;
  },

  generateUserAgent() {
    const versions = ['10', '11', '12', '13', '14'];
    const chromeVersions = ['139', '140', '141', '142'];
    
    const androidVersion = versions[Math.floor(Math.random() * versions.length)];
    const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
    
    return `Mozilla/5.0 (Linux; Android ${androidVersion}; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion}.0.0.0 Mobile Safari/537.36`;
  },

  generateGAValues() {
    const timestamp = Date.now();
    const random1 = Math.floor(Math.random() * 2000000000);
    const random2 = Math.floor(Math.random() * 2000000000);
    return {
      _ga: `GA1.2.${random1}.${timestamp}`,
      _gid: `GA1.2.${random2}.${timestamp}`,
      _ga_pfx: `GS2.1.s${timestamp}$o1$g${Math.floor(Math.random() * 100)}$t${timestamp}$j${Math.floor(Math.random() * 100)}$l0$h${random1}`
    };
  },

  generateGState() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return encodeURIComponent(JSON.stringify({
      i_l: 0,
      i_ll: timestamp,
      i_b: randomStr,
      i_e: { enable_itp_optimization: 1 }
    }));
  },

  getHeaders() {
    const anonymousId = this.generateAnonymousId();
    const guid = this.generateGuid();
    const userAgent = this.generateUserAgent();
    const gaValues = this.generateGAValues();
    const gState = this.generateGState();
    
    return {
      'authority': 'notegpt.io',
      'accept': '*/*',
      'accept-language': 'ar-EG,ar;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6',
      'content-type': 'application/json',
      'origin': 'https://notegpt.io',
      'referer': 'https://notegpt.io/ai-models/gemini-3-flash',
      'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': userAgent,
      'Cookie': [
        `anonymous_user_id=${anonymousId}`,
        `sbox-guid=${guid}`,
        `_ga_PFX3BRW5RQ=${gaValues._ga_pfx}`,
        `g_state=${gState}`,
        `_ga=${gaValues._ga}`,
        `_gid=${gaValues._gid}`,
        '_gat_gtag_UA_252982427_14=1'
      ].join('; ')
    };
  },

  async chat(message, conversationId = null) {
    try {
      const convId = conversationId || this.generateConversationId();
      
      const payload = {
        message: message,
        language: 'auto',
        model: 'gemini-3-flash-preview',
        tone: 'default',
        length: 'moderate',
        conversation_id: convId,
        image_urls: [],
        chat_mode: 'standard'
      };

      const headers = this.getHeaders();

      const response = await axios.post(
        `${this.apiURL}/chat/stream`,
        payload,
        {
          headers: headers,
          responseType: 'stream',
          timeout: 60000,
          decompress: true,
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized - Session expired');
      }

      if (response.status === 429) {
        throw new Error('Rate Limit - Too many requests');
      }

      return new Promise((resolve, reject) => {
        let fullResponse = '';
        let hasError = false;
        
        const encoding = response.headers['content-encoding'];
        let stream = response.data;
        
        if (encoding === 'gzip') {
          stream = response.data.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
          stream = response.data.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
          stream = response.data.pipe(zlib.createBrotliDecompress());
        }
        
        stream.on('data', (chunk) => {
          const text = chunk.toString('utf-8');
          
          try {
            const errorCheck = JSON.parse(text);
            if (errorCheck.code && errorCheck.message) {
              hasError = true;
              reject(new Error(errorCheck.message));
              return;
            }
          } catch (e) {}
          
          const lines = text.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataContent = line.substring(6);
              
              if (dataContent === '[DONE]') continue;
              
              try {
                const jsonData = JSON.parse(dataContent);
                
                if (jsonData.code && jsonData.message) {
                  hasError = true;
                  reject(new Error(jsonData.message));
                  return;
                }
                
                if (jsonData.content) {
                  fullResponse += jsonData.content;
                } else if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
                  fullResponse += jsonData.choices[0].delta.content;
                } else if (jsonData.text) {
                  fullResponse += jsonData.text;
                } else if (jsonData.message && !jsonData.code) {
                  fullResponse += jsonData.message;
                } else if (jsonData.response) {
                  fullResponse += jsonData.response;
                }
              } catch (e) {}
            }
          }
        });

        stream.on('end', () => {
          if (hasError) return;
          resolve({
            response: fullResponse,
            conversationId: convId
          });
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });

    } catch (error) {
      if (error.response) {
        throw new Error(`Server Error: ${error.response.status}`);
      }
      throw error;
    }
  }
};

// تخزين الجلسات لكل مستخدم
const userSessions = new Map();

const handler = async (m, { conn, args, text, command }) => {
  if (!text) {
    return m.reply('❌ الرجاء إدخال سؤالك\n\nمثال: .جيميناي ما هو الذكاء الاصطناعي؟\n\n💡 للحصول على جلسة محادثة مستمرة، استخدم نفس الأمر\n🔄 لمسح الجلسة: .مسح_جلسة');
  }

  await m.react('🤖');

  try {
    const userId = m.sender;
    
    // الحصول على معرف الجلسة للمستخدم أو إنشاء واحد جديد
    let conversationId = userSessions.get(userId);
    
    const result = await NoteGPTGeminiAPI.chat(text, conversationId);

    if (!result.response || result.response.trim() === '') {
      return m.reply('❌ لم أتمكن من الحصول على رد. حاول مرة أخرى لاحقاً.');
    }

    // حفظ معرف الجلسة للمستخدم
    userSessions.set(userId, result.conversationId);

    let reply = result.response;
    
    // إضافة رسالة للجلسة الجديدة
    if (!conversationId) {
      reply += '\n\n💬 _تم إنشاء جلسة محادثة جديدة. يمكنك الاستمرار في المحادثة._';
    }

    await m.reply(reply);
    await m.react('✅');

  } catch (error) {
    await m.react('❌');
    
    let errorMsg = '❌ فشل الطلب\n\n';
    
    if (error.message.includes('daily limit') || error.message.includes('164005')) {
      errorMsg += '⏰ تم تجاوز الحد اليومي المجاني. حاول غداً.';
    } else if (error.message.includes('Rate Limit')) {
      errorMsg += '⏳ تم تجاوز معدل الطلبات. انتظر قليلاً.';
    } else if (error.message.includes('Session expired')) {
      // حذف الجلسة القديمة
      userSessions.delete(m.sender);
      errorMsg += '🔄 انتهت صلاحية الجلسة. أرسل رسالتك مرة أخرى لبدء جلسة جديدة.';
    } else {
      errorMsg += '⚠️ حدث خطأ غير متوقع. حاول مرة أخرى.\n\nالخطأ: ' + error.message;
    }
    
    return m.reply(errorMsg);
  }
};

// إضافة أمر لمسح الجلسة
handler.before = async function (m, { conn }) {
  if (m.text === '.مسح_جلسة' || m.text === '.reset_session') {
    userSessions.delete(m.sender);
    await m.reply('✅ تم مسح جلسة المحادثة. سيتم إنشاء جلسة جديدة في المرة القادمة.');
    return true;
  }
  return false;
};

handler.command = /^(جيميناي|جيمي|gemini)$/i;
handler.help = ['جيميناي', 'gemini'];
handler.tags = ['ai'];

export default handler;