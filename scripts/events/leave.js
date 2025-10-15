const { getTime, drive } = global.utils;
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "leave",
		version: "1.5",
		author: "NTKhang + Helal Edit",
		category: "events"
	},

	langs: {
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "left",
			leaveType2: "was kicked from",
			defaultLeaveMessage: "{userName} {type} the group"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType !== "log:unsubscribe") return;
		
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		if (!threadData?.settings?.sendLeaveMessage) return;

		const { leftParticipantFbId } = event.logMessageData;
		if (leftParticipantFbId == api.getCurrentUserID()) return;

		const hours = getTime("HH");
		const threadName = threadData.threadName;
		const userName = await usersData.getName(leftParticipantFbId);

		let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
		leaveMessage = leaveMessage
			.replace(/\{userName\}|\{userNameTag\}/g, userName)
			.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
			.replace(/\{threadName\}|\{boxName\}/g, threadName)
			.replace(/\{time\}/g, hours)
			.replace(/\{session\}/g,
				hours <= 10 ? getLang("session1") :
				hours <= 12 ? getLang("session2") :
				hours <= 18 ? getLang("session3") : getLang("session4")
			);

		try {
			// 🎬 ভিডিও ডাউনলোড
			const videoUrl = "https://i.imgur.com/KwXubhi.mp4";
			const videoPath = __dirname + "/cache/leaveVideo.mp4";

			const buffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
			fs.writeFileSync(videoPath, Buffer.from(buffer, "binary"));

			// 📤 পাঠানো
			await message.send({
				body: `${userName} left the group 😔`,
				attachment: fs.createReadStream(videoPath)
			}, threadID);

			fs.unlinkSync(videoPath);
		} catch (e) {
			console.error("❌ Leave video error:", e);
		}
	}
};
