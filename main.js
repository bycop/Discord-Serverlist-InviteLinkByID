const Discord = require('discord.js');

var bot = new Discord.Client();

var prefix = ("c!");
bot.login("token");

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

  // you can of course customise this embed however you want
  const embed = new Discord.MessageEmbed()
    .setTitle(`Showing guilds ${start + 1}-${start + current.length} out of ${guilds.length}`)
	.setColor(0x206694)
  current.forEach(g => embed.addField(g.name, `**ID:** ${g.id}
**Members**: ${g.memberCount}
**Owner:** ${g.owner.user.tag}`))
embed.addField("To join a Guild use:", "`c!get-invite <ID>`")
  return embed
}


const author = message.author

// send the embed with the first 5 guilds
message.channel.send(generateEmbed(0)).then(message => {
  // exit if there is only one page of guilds (no need for all of this)
  if (guilds.length <= 5) return
  // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
  message.react('➡️')
  const collector = message.createReactionCollector(
    // only collect left and right arrow reactions from the message author
    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
    // time out after a minute
    {time: 60000}
  )

  let currentIndex = 0
  collector.on('collect', reaction => {
    // remove the existing reactions
    message.reactions.removeAll().then(async () => {
      // increase/decrease index
      reaction.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5
      // edit message with new embed
      message.edit(generateEmbed(currentIndex))
      // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
      if (currentIndex !== 0) await message.react('⬅️')
      // react with right arrow if it isn't the end
      if (currentIndex + 5 < guilds.length) message.react('➡️')
    })
  })
})
}
	//embed-ized
	if (message.content.startsWith(prefix + "get-invite")) {
		const arg = args.slice(1).join(" ");
		let sv = bot.guilds.cache.get(arg)
		if (!sv) {
			return message.channel.send(`Enter a valid guild ID`);
		} else {
			sv.channels.cache.random().createInvite({maxAge: 0})
			.then( a =>
			embed = new Discord.MessageEmbed()
			.setTitle(`Here is your invite for "${sv.name}"`)
			.setColor(0x206694)
			.setThumbnail('https://s6.gifyu.com/images/emoji_84.gif')
			.addField("Invite link : " + a.toString(), `Have fun in there and dont forget: Cynthia Eternal!`)
			).then(embed => message.author.send(embed))
			}
	}
});
