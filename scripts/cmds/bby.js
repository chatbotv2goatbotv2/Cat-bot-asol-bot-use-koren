const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam", "bot", "chat"],
    version: "6.9.0",
    author: "dipto | nexo_here",
    countDown: 0,
    role: 0,
    description: "better than all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(parts[1])}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            const parts = dipto.replace("teach react ", "").split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach react message - ❤️, 😀', event.threadID, event.messageID);
            const msg = parts[0].trim();
            const reacts = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&react=${encodeURIComponent(reacts)}`);
            return api.sendMessage(`✅ Reacts added: ${res.data.message}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach amar message - reply', event.threadID, event.messageID);
            const msg = parts[0].replace("teach amar ", "").trim();
            const reply = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&senderID=${uid}&reply=${encodeURIComponent(reply)}&key=intro`);
            return api.sendMessage(`✅ Intro reply added: ${res.data.message}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach message - reply1, reply2', event.threadID, event.messageID);
            const msg = parts[0].replace("teach ", "").trim();
            const replies = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&reply=${encodeURIComponent(replies)}&senderID=${uid}&threadID=${event.threadID}`);
            const teacherName = (await usersData.get(res.data.teacher)).name || "Unknown";
            return api.sendMessage(`✅ Replies added: ${res.data.message}\n👤 Teacher: ${teacherName}\n📚 Total Teachs: ${res.data.teachs}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=${encodeURIComponent("amar name ki")}&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, message }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
            if (body.startsWith("baby")|| body.startsWith("kakashi") || body.startsWith("sakura")|| body.startsWith("bot")|| body.startsWith("hi") || body.startsWith("bby") || body.startsWith("sifat")|| body.startsWith("kakashi") || body.startsWith("oi")) {
            const arr = body.replace(/^\S+\s*/, "");
            const randomReplies = ["ʙᴏʟᴏ ʙᴀʙᴜ, ᴛᴜᴍɪ ᴋɪ ᴀᴍᴀᴋᴇ ʙʜᴀʟᴏʙᴀꜱᴏ? 🙈💋",
        "ᴋᴀʟᴋᴇ ᴅᴇᴋʜᴀ ᴋᴏʀɪꜱ ᴛᴏ ᴇᴋᴛᴜ 😈ᴋᴀᴊ ᴀꜱᴇ😒",
        "ᴅᴜʀᴇ ᴊᴀ, ᴛᴏʀ ᴋᴏɴᴏ ᴋᴀᴊ ɴᴀɪ, ꜱʜᴜᴅʜᴜ 𝗯𝗯𝘆 𝗯𝗯𝘆 ᴋᴏʀɪꜱ  😉😋🤣",
        "ᴛᴏʀ ᴋɪ ᴄʜᴏᴋʜᴇ ᴘᴏʀᴇ ɴᴀ ᴀᴍɪ BESTHO ᴀꜱɪ😒",
        "ʜᴏᴘ ʙᴇᴅᴀ😾,ʙᴏꜱꜱ ʙᴏʟ ʙᴏꜱꜱ😼",
        "ɢᴏꜱʜᴏʟ ᴋᴏʀᴇ ᴀʏ ᴊᴀ😑😩",
        "ᴇᴛᴀʏ ᴅᴇᴋʜᴀʀ ʙᴀᴋɪ ꜱɪʟᴏ_🙂🙂🙂",
        "ᴀᴍɪ ᴛʜᴀᴋʟᴇᴏ ᴊᴀ, ɴᴀ ᴛʜᴀᴋʟᴇᴏ ᴛᴀ !❤",
        "ᴛᴏʀ ʙɪʏᴇ ʜᴏʏ ɴɪ 𝗕𝗯𝘆 ʜᴏɪʟᴏ ᴋɪʙʜᴀʙᴇ,,🙄",
        "ᴄʜᴜᴘ ᴛʜᴀᴋ ᴛᴏ naile ᴛᴏʀ ᴅᴀᴛ ʙʜᴇɢᴇ ᴅɪʙᴏ ᴋɪɴᴛᴜ",
        "ᴛᴜᴍᴀʀᴇ ᴀᴍɪ ʀᴀɪᴛᴇ ʙʜᴀʟᴏʙᴀꜱɪ 🐸📌",
        "ᴀᴊᴋᴇ ᴀᴍᴀʀ ᴍᴏɴ ʙʜᴀʟᴏ ɴᴇɪ",
        "ᴏɪ ᴛᴜᴍɪ ꜱɪɴɢʟᴇ ɴᴀ?🫵🤨",
        "ᴀʀᴇ ᴀᴍɪ ᴍᴏᴊᴀ ᴋoʀᴀʀ ᴍᴏᴏᴅ ᴇ ɴᴀɪ😒",
        "ᴀᴍɪ ᴏɴnᴇʀ ᴊɪɴɪꜱᴇʀ ꜱᴀᴛʜᴇ ᴋᴛʜᴀ ʙᴏʟɪ ɴᴀ__😏",
        "ᴏᴋᴇ 𝙵𝙖𝙧𝙢𝙖𝙬__😒",
        "ʙʜᴜʟᴇ ᴊᴀᴏ ᴀᴍᴀᴋᴇ 😞😞",
        "𝗧𝗼𝗿 𝘀𝗮𝘁𝗲 𝗸𝗼𝘁𝗵𝗮 𝗻𝗮𝗶,𝗧𝘂𝗶 𝗮𝗯𝗮𝗹😼",
        "ᴀᴍɪ ᴀʙᴀʟ ᴅᴇʀ ꜱᴀᴛʜᴇ ᴋᴛʜᴀ ʙᴏʟɪ ɴᴀ,ᴏᴋ😒",
        "ᴀᴍʀ ᴊᴀɴᴜ ʟᴀɢʙᴇ,ᴛᴜᴍɪ ᴋɪ ꜱɪɴɢʟᴇ ᴀꜱᴏ?",
        "ᴇᴛᴏ CUTE ᴋᴇᴍɴᴇ ʜᴏɪʟɪ ! ᴋɪ ᴋʜᴀꜱ😒",
        "ʜᴀ ᴊᴀɴᴜ , ᴇɪᴅɪᴋ ᴇ ᴀꜱᴏ ᴋɪꜱs ᴅᴇɪ🤭 😘",
        "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
        "ꜰʟɪʀᴛ ᴍᴀᴛ ᴋᴀʀᴏ ꜱᴀᴅɪ ʙᴀʟɪ ʙᴀᴛ ᴋᴀʀᴏᴏ😒",
        "ᴀᴍᴀʀ ᴇxᴀᴍ ᴀᴍɪ ᴘᴏʀᴛᴀꜱɪ",
        "ᴍᴏʀᴇ ɢᴇꜱɪ ᴋᴀʀᴏɴ ᴛᴏᴍᴀᴋᴇ ꜱᴀʀᴀ ᴀᴍɪ ʙᴀᴄᴍᴜ ɴᴀ",
        "ʙᴇꜱʜɪ ʙʙʏ ʙʙʙʏ ᴋᴏʀʟᴇ ʟᴇᴀᴠᴇ ɴɪʙᴏ ᴋɪɴᴛᴜ😒😒",
        "ᴀᴍɪ ᴛᴏᴍᴀʀ ꜱɪɴɪᴏʀ ᴀᴘᴜ ᴏᴋᴇ 😼",
        "ꜱᴏᴍᴍᴀɴ ᴅᴇᴏ🙁",
        "ᴍᴇꜱꜱᴀɢᴇ ɴᴀ ᴅɪʏᴇ ᴛᴏ ᴄᴀʟʟ ᴀᴡ ᴅɪᴛᴇ ᴘᴀʀᴏ ᴛᴀʏ ɴᴀ?",
        "ᴀᴍᴀᴋᴇ ᴅᴇᴋᴏ ɴᴀ,ᴀᴍɪ ʙusy ᴀꜱɪ",
        "ᴛᴏʀᴀ ᴊᴇ ʜᴀʀᴇ 𝗕𝗯𝘆 ᴅᴀᴋᴄʜɪꜱ ᴀᴍɪ ᴛᴏ ꜱᴏtti ʙᴀᴄᴄʜᴀ ʜᴏʏᴇ ᴊᴀʙᴏ_☹😑",
        "ᴋᴇᴍon ᴀꜱᴏ",
        "ꜱᴜɴᴏ ᴅʜᴏɪʀᴊᴏ ᴀʀ ꜱᴏʜᴊᴏ ᴊɪʙᴏɴᴇʀ ꜱᴏʙ😊🌻💜",
        "ɢᴏʟᴀᴘ ꜰᴜʟ ᴇʀ ᴊᴀʏɢᴀʏ ᴀᴍɪ ᴅɪʟᴀᴍ ᴛᴏᴍᴀʏ msg°",
        "ᴋoᴛʜᴀ ᴅᴇᴏ ᴀᴍᴀᴋᴇ ᴘᴏᴛᴀʙᴀ...!!😌",
        "ᴇᴍʙɪ ᴋɪɴᴇ ᴅᴇᴏ ɴᴀ_🥺🥺",
        "ɢꜰ ʙʜᴇʙᴇ ᴇᴋᴛᴜ ꜱʜᴀꜱᴏɴ ᴋᴏʀᴇ ᴊᴀᴏ!🐸",
        "ɢᴏʀᴜ ᴜᴅᴅᴇ ᴀᴋᴀꜱʜᴇ ꜱᴀʟᴀᴍɪ ᴘᴀᴛʜᴀɴ ʙɪᴋᴀꜱʜᴇ 💸💰",
        "ʙᴏʟᴇɴ _😌",
        "ʙᴀʀ ʙᴀʀ ᴅɪꜱᴛᴜʀʙ ᴋᴏʀᴇᴄʜɪꜱ ᴋɴᴏ😾,",
        "ᴀᴍᴀʀ ᴊᴀɴᴜ ᴇʀ ꜱᴀᴛʜᴇ ʙʏᴀꜱᴛᴏ ᴀꜱɪ😋-",
        "ᴄʜᴏᴜᴅʜᴜʀɪ ꜱᴀʜᴇʙ ᴀᴍɪ ɢᴏʀɪʙ ʜᴏᴛᴇ ᴘᴀʀɪ.😾🤭 ᴋɪɴᴛᴜ-ʙᴏʀᴏʟᴏᴋ ɴᴀ.🥹😫",
        "ᴀʀ ᴀᴋʙᴀʀ ʙᴀʙʏ ʙᴏʟʟᴇ ᴅᴇɪᴋʜᴏ ᴛᴏᴍᴀʀ 1 ᴅɪɴ  ɴᴀᴋɪ ᴀᴍʀ 10 ᴅɪɴ😒",
        "ᴋɪ ´･ᴗ･`",
        "ᴋɪ ʜᴏʟᴏ ,ᴍɪꜱ ᴛɪꜱ ᴋᴏʀᴄᴄʜɪꜱ ɴᴀᴋɪ🤣",
        "ᴋᴀᴄʜᴇ ᴀꜱᴏ ᴋᴏᴛʜᴀ ᴀꜱᴇ",
        "ᴀᴍ ɢᴀᴄʜᴇ ᴀᴍ ɴᴀɪ ᴅʜɪʟ ᴋᴇɴᴏ ᴍᴀʀᴏ, ᴛᴏᴍᴀʀ ꜱᴀᴛʜᴇ ᴘʀᴇᴍ ɴᴀɪ ʙᴇʙʏ ᴋᴇɴᴏ ᴅᴀᴋᴏ",
        "ᴀɢᴇ ᴇᴋᴛᴀ ɢᴀɴ ʙᴏʟᴏ,☹ɴᴀʜᴏʟᴇ ᴋᴏᴛʜᴀ ʙᴏʟʙᴏ ɴᴀ_🥺",
        "ᴀᴄᴄʜᴀ ꜱʜᴜɴᴏ_😒",
        "𝗕𝗯𝘆 ɴᴀ ᴊᴀɴᴜ,ʙᴏʟ 😌",
        "ʟᴜɴɢɪ ᴛᴀ ᴅʜᴏʀ ᴍᴜᴛᴇ ᴀꜱɪ🙊🙉",
        "ᴛᴏᴍᴀᴋᴇ ꜱᴀʀᴀ ᴀᴍɪ ʙᴀᴄʜᴍᴜ ɴᴀ ʙᴀʙʏ",
        "ᴛᴏᴍᴀʀ ʟᴀɴɢ ᴋᴇᴍᴏɴ ᴀꜱᴇ?",
        "ᴛᴜᴍɪ ᴇᴛᴏ ʙʙʏ ɴᴀ ᴅᴇᴋᴇ ʙᴏᴜ ᴅᴀᴋᴏ",
        "ᴍɪꜱꜱ ᴋᴏʀꜱᴇʟᴀ ?",
        "ᴏɪ ᴍᴀᴍᴀ ᴀʀ ᴅᴀᴋɪꜱ ɴᴀ ᴘʟɪᴢ",
        "ᴀᴍᴀᴋᴇ ɴᴀ ᴅᴇᴋʜᴇ ᴇᴋᴛᴜ ᴘᴏʀᴏᴛᴇᴏ ʙᴏꜱʜᴛᴇ ᴛᴏ ᴘᴀʀᴏ🥺🥺",
        "𝗕𝗯𝘆 ʙᴏʟᴇ ᴏꜱʜᴏᴍᴍᴀɴ ᴋᴏʀᴄᴄʜɪꜱ,😰😿",
        "ᴍᴇꜱꜱᴀɢᴇ ɴᴀ ᴅɪʏᴇ ᴛᴏ ᴛᴇᴀᴄʜ ᴀᴡ ᴅɪᴛᴇ ᴘᴀʀᴏ ᴛᴀʏ ɴᴀ?",
        "ᴀᴊ ᴇᴋᴛᴀ ꜰᴏɴ ɴᴀɪ ʙᴏʟᴇ ʀɪᴘʟᴀʏ ᴅɪᴛᴇ ᴘᴀʀʟᴀᴍ ɴᴀ_🙄",
        "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
        "𝗕𝗯𝘆 𝗻𝗮 𝗯𝗼𝗹𝗲,,𝗚𝗿𝗼𝘂𝗽 𝗮 𝗰𝗮𝗹𝗹 𝗹𝗮𝗴𝗮😑😑😑",
        "ᴀʀ ᴋᴏᴛ ʙᴀʀ ᴅᴀᴋʙɪ ,ꜱʜᴜɴᴄʜɪ ᴛᴏ",
        "ʙꜰ ʙʜᴇʙᴇ ᴇᴋᴛᴜ ꜱʜᴀꜱᴏɴ ᴋᴏʀᴇ ᴊᴀᴏ!🐸",
        "𝗕𝗯𝘆 ʙᴏʟʟᴇ ᴄʜᴀᴋʀɪ ᴛʜᴀᴋʙᴇ ɴᴀ",
        "ᴀᴊʙ ᴛᴏ__😒",
        "ᴇᴋᴛᴀ ʙꜰ ᴋʜᴜɴᴊᴇ ᴅᴇᴏ 🥺🥺",
        "ᴍʙ ɴᴇʏ ʙʏᴇ",
        "ᴏɪ ᴍᴀᴍᴀ ᴀʀ ᴅᴀᴋɪꜱ ɴᴀ ᴘɪʟɪꜱ",
        "ᴇᴛᴏᴋʜʜᴏɴ ᴘᴏʀᴇ ᴍᴏɴᴇ ʜᴏɪʟᴏ ᴀᴍᴀᴋᴇ?🙁",
        "ᴀᴍɪ ᴛᴏ ᴏɴᴅʜᴏ ᴋɪᴄʜᴜ ᴅᴇᴋʜɪ ɴᴀ🐸 😎",
        "ᴏ ᴀᴄᴄʜᴀ",
        "ᴀᴍᴀʀ ꜱᴏɴᴀʀ ʙᴀɴɢʟᴀ ,ᴛᴀʀᴘᴏʀᴇ ʟᴀɪɴ ᴋɪ ?",
        "ʙᴀʙʏ ꜱᴜɴᴏ ꜱᴇɪ ᴀᴋᴛᴀ ᴡᴇᴀᴛʜᴇʀ ᴛᴀʏ ɴᴀ ʙᴏʟᴏ🫣",
        "৩২ ᴛᴀʀɪᴋʜ ᴀᴍᴀʀ ʙɪʏᴇ",
        "ʜᴀ ʙᴏʟᴏ, ꜱʜᴜɴᴄʜɪ ᴀᴍɪ 😏",
        "ʙᴏʟᴏ ꜰᴜʟᴛᴜꜱʜɪ_😘",
        "ᴛᴜᴍɪ ᴏ ᴇᴋᴀ, ᴀᴍɪ ᴏ ᴇᴋᴀ ᴇʙᴀʀ ᴀᴍᴀᴅᴇʀ ᴘʀᴇᴍ ᴊᴏᴍʙᴇ ᴊʜᴀᴋᴀɴᴀᴋᴀ😁😁",
        "ᴠᴀʟᴏ ᴋɪ ʜᴏɪʙᴀ ɴᴀ?",
        "৮১ , ৮২ , ৮৩ ᴀᴍɪ ᴛᴏᴍᴀᴋᴇ ʙʜᴀʟᴏʙᴀꜱɪ",
        "ʜᴀ ʙᴏʟᴏ😒,ᴋɪ ᴋᴏʀᴛᴇ ᴘᴀʀɪ😐😑?",
        "ᴇᴛᴏ ᴅᴀᴋᴄʜɪꜱ ᴋɴᴏ?",
        "ɢᴀʟɪ ꜱʜᴜɴʙɪ ɴᴀᴋɪ? 🤬",
        "ʙᴏʟᴏ ᴋɪ ʙᴏʟʙᴀ, ꜱʙᴀʀ ꜱᴀᴍɴᴇ ʙᴏʟʙᴀ ɴᴀᴋɪ?🤭🤏",
        "𝘼𝙢𝙞 𝙠𝙖𝙡𝙖 𝙣𝙖 𝙨𝙪𝙣𝙨𝙚 ,𝙗𝙤𝙡𝙤 𝙠𝙞 𝙗𝙤𝙡𝙗𝙖",
        "ꜱᴏʀʀʏ ᴀᴍɪ ʙᴜꜱʏ ᴀꜱɪ",
        "ʙᴏʟᴇɴ ꜱɪʀ__😌",
        "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏",
        "ʙᴏʟᴏ ᴋɪ ᴋᴏʀᴛᴇ ᴘᴀʀɪ ᴛᴏᴍᴀʀ ᴊᴏɴɴᴏ",
        "ᴇɪ ɴᴀᴏ ᴊᴜꜱ ᴋʜᴀᴏ..! ʙʙʏ ʙᴏʟᴛᴇ ʙᴏʟᴛᴇ ʜᴀᴘᴀɪ ɢᴇᴄʜᴏ ɴᴀ 🥲",
        "ᴅᴇᴋʜᴀ ʜᴏʟᴇ ᴋᴀᴛʜɢᴏʟᴀᴘ ᴅɪᴏ..🤗",
        "ᴀᴍᴀᴋᴇ ᴅᴀᴋʟᴇ, ᴀᴍɪ ᴋɪɴᴛᴜ ᴋɪꜱꜱ ᴋᴏʀᴇ ᴅɪʙᴏ 😘",
        "ʙᴇꜱɪ ʙᴇʙɪ ʙᴏʟʟᴇ ᴋᴀᴍᴜʀ ᴅɪᴍᴜ,,🤭",
        "ɪ ʟᴏᴠᴇ ʏᴏᴜ! ᴀᴍᴀʀ ꜱᴏɴᴀ, ᴍᴏʏɴᴀ, ᴛɪʏᴀ 😍",
        "ᴀᴍᴀᴋᴇ ᴋɪ ᴛᴜᴍɪ ʙʜᴀʟᴏʙᴀꜱᴏ? 💕",
        "ᴊᴀ ᴠᴀɢ, ᴄʜɪᴘᴀʙᴀᴢ__😼",
        "ᴛᴜɪ ꜱᴇɪ ʟᴜɪᴄᴄʜᴀᴛᴀ ɴᴀ!? 🙂🔪",
        "ᴋɪ ʜᴏɪꜱᴇ ᴀᴍᴀʀ ᴋɪ ᴋᴀᴊᴇ ʟᴀɢʙᴇ ᴛᴜʀ!? 🌚👀",
        "ᴛᴏʀ ᴋᴏᴛʜᴀ ᴛᴏʀ ʙᴀʀɪ ᴋᴇᴜ ꜱᴜɴᴇ ɴᴀ, ᴛᴏ ᴀᴍɪ ᴋᴇɴᴏ ꜱᴜɴʙᴏ? 🤔😂",
        "ʙᴇꜱɪ ᴅᴀᴋʟᴇ ᴀᴍᴍᴜ ʙᴏᴋᴀ ᴅᴇʙᴀ ᴛᴏ__🥺",
        "ᴀᴍɪ ʙᴏᴛ ɴᴀ, ᴀᴍᴀᴋᴇ ʙʙʏ ʙᴏʟᴏ ʙʙʏ!! 😘",
        "ᴛᴏʀ ʜᴀᴀᴛ ᴅʜᴏʀʟᴇ ᴍᴏɴ ʜᴏʏ ᴀᴍɪ ʙᴀᴛᴛᴇʀʏ ᴄʜᴀʀɢᴇ ᴋᴏʀᴛᴇꜱɪ 🥀",
        "ᴛᴜɪ ᴀᴍᴀʀ ᴄʜᴏᴋʜ ᴇʀ ᴠɪᴛᴀᴍɪɴ… ᴅᴇᴋʜᴀ ɴᴀ ᴅɪʟᴇ ᴀᴍɪ ᴡᴇᴀᴋ ʜᴏʏᴇ ᴊᴀɪ 👀",
        "ᴛᴏʀ ᴇᴋᴛᴀ ʜᴀʟꜰ ꜱᴍɪʟᴇ ᴀᴍᴀʀ ꜱᴏɴᴀ ʀᴀᴛ ᴄʜᴀɴɢᴇ ᴋᴏʀᴇ ᴅɪꜱʜᴇ 🔥",
        "ᴄʜᴀɴᴅᴇʀ ᴀʟᴏ ᴛᴇ ᴛᴏʀ ᴍᴜᴋʜ ᴅᴇᴋʜʟᴇ ᴍᴏɴ ʜᴏʏ ᴄʜᴏʀɪ ᴋᴏʀᴇ ɴɪʏᴇ ᴊᴀɪ 💋",
        "_tumi amar naughty boy! 🫣",
        "ʜᴇʏ,ʙʀᴏᴏ ɪᴛs ᴍᴇ ᴋᴀᴋᴀsɪ",
        "ᴀʀ ᴅᴀᴋɪs ɴᴀ ʙᴀᴀᴘ 🙂 "];
            if (!arr) {
                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found");
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
                return;
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
