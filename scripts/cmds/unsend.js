module.exports = {
    config: {
        name: "unsend",
        aliases: ["u", "un", "r"],
        version: "1.2",
        author: "|SHIFAT",
        countDown: 5,
        role: 0,
        description: {
            vi: "Gỡ tin nhắn của bot",
            en: "Unsend bot's message"
        },
        category: "box chat",
        guide: {
            vi: "reply tin nhắn muốn gỡ của bot và gọi lệnh {pn}",
            en: "reply the message you want to unsend and call the command {pn}"
        }
    },

    langs: {
        vi: {
            syntaxError: "Vui lòng reply tin nhắn muốn gỡ của bot"
        },
        en: {
            syntaxError: "Please reply the message you want to unsend"
        }
    },

    onStart: async function ({ message, event, api, getLang }) {
        try {
            if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID()) {
                return message.reply(getLang("syntaxError"));
            }

            // ✅ Goat Bot এ unsend করার সঠিক পদ্ধতি
            api.unsendMessage(event.messageReply.messageID, (err) => {
                if (err) {
                    message.reply("❌ Failed to unsend message.");
                } else {
                    message.reply("✅ Message unsent successfully!");
                }
            });

        } catch (e) {
            console.error(e);
            message.reply("❌ Error while trying to unsend message.");
        }
    }
};
