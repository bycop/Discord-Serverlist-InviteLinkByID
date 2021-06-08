const Discord = require('discord.js');

var bot = new Discord.Client();

var prefix = ("!");
bot.login("Insert token here");

bot.on('ready', () => {
	console.log("Serverlist ready!");
});

bot.on('message', message => {

	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);

	if (message.content.startsWith(prefix + "serverlist")) {
		const guilds = bot.guilds.cache.array().sort((a, b) => b.memberCount - a.memberCount)

		/**
		 * 
		 * @param {number} start
		 */
		const generateEmbed = start => {
			const current = guilds.slice(start, start + 5)

			const embed = new Discord.MessageEmbed()
				.setTitle(`Showing guilds ${start + 1}-${start + current.length} out of ${guilds.length}`)
				.setColor(0x206694)
			current.forEach(g => embed.addField(g.name, `**ID:** ${g.id}
**Members**: ${g.memberCount}`))
			embed.addField("To join a Guild use:", "`!get-invite <ID>`")
			return embed
		}


		const author = message.author

		message.channel.send(generateEmbed(0)).then(message => {
			if (guilds.length <= 5) return
			message.react('➡️')
			const collector = message.createReactionCollector(
				(reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
				{ time: 60000 }
			)

			let currentIndex = 0
			collector.on('collect', reaction => {
				message.reactions.removeAll().then(async () => {
					reaction.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5
					message.edit(generateEmbed(currentIndex))
					if (currentIndex !== 0) await message.react('⬅️')
					if (currentIndex + 5 < guilds.length) message.react('➡️')
				})
			})
		})
	}
	if (message.content.startsWith(prefix + "get-invite")) {
		const arg = args.slice(1).join(" ");
		let sv = bot.guilds.cache.get(arg)
		if (!sv) {
			return message.channel.send(`Enter a valid guild ID`);
		} else {
			sv.channels.cache.random().createInvite({ maxAge: 0 })
				.then(a =>
					embed = new Discord.MessageEmbed()
						.setTitle(`Here is your invite for "${sv.name}"`)
						.setColor(0x206694)
						.setThumbnail('https://s6.gifyu.com/images/emoji_84.gif')
						.setDescription("Invite link : " + a.toString())
				).then(embed => message.author.send(embed))
		}
	}
});
