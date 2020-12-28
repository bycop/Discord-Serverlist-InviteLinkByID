const Discord = require('discord.js');

var bot = new Discord.Client();

var prefix = ("!");
bot.login("Your token here");

bot.on('ready', () => {
	console.log("Global ready !");
});

bot.on('message', message => {

	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);

	if (message.content.startsWith(prefix + "serverlist")) {
		(async function () {
			let p0 = 0;
			let p1 = 10;
			const data = await message.channel.send(bot.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map(r => r).map((r, i) => `[${i + 1}] • Name: \`${r.name.toString()}\`\nUsers: \`${r.memberCount}\`\nID: \`${r.id}\``).slice(0, 10).join('\n'));
			await data.react("⬅");
			await data.react("➡");
			await data.react("❌");
			const data_res = data.createReactionCollector((reaction, user) => user.id === message.author.id);
			data_res.on("collect", async (reaction) => {
				if (reaction.emoji.name === "⬅") {
					p0 = p0 - 10;
					p1 = p1 - 10;
					if (p0 < 0) return data.delete();
					if (p0 === undefined || p1 === undefined) return data.delete();
					data.edit(bot.guilds.sort((a, b) => b.memberCount - a.memberCount).map(r => r).map((r, i) => `[${i + 1}] • Name: \`${r.name.toString()}\`\nUsers: \`${r.memberCount}\`\nID: \`${r.id}\``).slice(p0, p1).join('\n'));
				}
				if (reaction.emoji.name === "➡") {
					p0 = p0 + 10;
					p1 = p1 + 10;
					if (p1 > bot.guilds.size + 10) return data.delete();
					if (p0 === undefined || p1 === undefined) return data.delete();
					data.edit(bot.guilds.sort((a, b) => b.memberCount - a.memberCount).map(r => r).map((r, i) => `[${i + 1}] • Name: \`${r.name.toString()}\`\nUsers: \`${r.memberCount}\`\nID: \`${r.id}\``).slice(p0, p1).join('\n'));
				}
				if (reaction.emoji.name === "❌") {
					return data.delete(data);
				}
				await reaction.remove(message.author.id);
			})
		}())
	}
	if (message.content.startsWith(prefix + "invitestaff")) {
		const arg = args.slice(1).join(" ");

		let sv = bot.guilds.cache.get(arg)
		if (!sv) {
			return message.channel.send(`Enter a valid guild id`);
		} else {
			sv.channels.cache.random().createInvite({
				maxAge: 0
			}).then(a => message.author.send("Invite link : " + a.toString()))
		}
	}
});