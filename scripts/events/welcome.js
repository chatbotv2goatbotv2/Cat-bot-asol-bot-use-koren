const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "2.0",
        author: "Helal",
        category: "events"
    },

    langs: {
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "Thank you for inviting me to the group!\nBot prefix: %1\nTo view the list of commands, type: %1help",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: `
•🦋𓂃🦋𓂃🦋𓂃🦋𓂃🦋•     
    •❥❥❥❥❥♥❥❥❥❥❥•
      ✮•°𝑾𝒆𝒍𝒄𝒐𝒎𝒆°•✮•        
 ✫     {username}       ༂         
• °•✮•°•✮•°•✮•°•✮•°•✮• •
•°•°•°•°•°•°•°•°•°•°•°•°•°•°• •
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊  ❣️  ┊   ┊   ❣️
   ┊   ┊  ❣️        ┊  ❣️    
  ❣️  ┊              ❣️           
        ❣️
Welcome to {boxName} 💖
Have a nice {session}! 🍁`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe")
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;

                // If new member is the bot itself
                if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                    return message.send(getLang("welcomeMessage", prefix));
                }

                // Initialize temp data if not exists
                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                // Push new members
                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                // Delay a bit to collect multiple joins
                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false) return;

                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [], mentions = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1) multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some(item => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                        mentions.push({
                            tag: user.fullName,
                            id: user.userFbId
                        });
                    }

                    if (userName.length == 0) return;

                    let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
                    const form = {
                        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                    };

                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                        .replace(
                            /\{session\}/g,
                            hours <= 10
                                ? getLang("session1")
                                : hours <= 12
                                    ? getLang("session2")
                                    : hours <= 18
                                        ? getLang("session3")
                                        : getLang("session4")
                        );

                    form.body = welcomeMessage;

                    if (threadData.data.welcomeAttachment) {
                        const files = threadData.data.welcomeAttachment;
                        const attachments = files.reduce((acc, file) => {
                            acc.push(drive.getFile(file, "stream"));
                            return acc;
                        }, []);
                        form.attachment = (await Promise.allSettled(attachments))
                            .filter(({ status }) => status == "fulfilled")
                            .map(({ value }) => value);
                    }

                    message.send(form);
                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
    }
};