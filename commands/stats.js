const { EmbedBuilder } = require("discord.js")
const { getText, formatText } = require("../utils/language")
const os = require("os")

module.exports = {
  name: "stats",
  description: "Show bot statistics / Bot istatistikleri",
  async execute(interaction, { client }) {
    const guildId = interaction.guild.id
    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor(uptime / 3600) % 24
    const minutes = Math.floor(uptime / 60) % 60
    const seconds = Math.floor(uptime % 60)

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(getText(guildId, "messages.stats.title"))
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: getText(guildId, "messages.stats.field_servers"), value: `${client.guilds.cache.size}`, inline: true },
        { name: getText(guildId, "messages.stats.field_users"), value: `${client.users.cache.size}`, inline: true },
        {
          name: getText(guildId, "messages.stats.field_channels"),
          value: `${client.channels.cache.size}`,
          inline: true,
        },
        { name: getText(guildId, "messages.stats.field_ping"), value: `${Math.round(client.ws.ping)}ms`, inline: true },
        {
          name: getText(guildId, "messages.stats.field_uptime"),
          value: `${days}g ${hours}s ${minutes}d ${seconds}sn`,
          inline: true,
        },
        {
          name: getText(guildId, "messages.stats.field_memory"),
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          inline: true,
        },
        { name: getText(guildId, "messages.stats.field_os"), value: `${os.type()} ${os.release()}`, inline: true },
        { name: getText(guildId, "messages.stats.field_node"), value: `${process.version}`, inline: true },
        { name: getText(guildId, "messages.stats.field_discord"), value: `v14.14.1`, inline: true },
      )
      .setFooter({
        text: formatText(guildId, "messages.stats.footer", { tag: client.user.tag }),
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
