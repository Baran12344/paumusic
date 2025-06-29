const { EmbedBuilder } = require("discord.js")
const { getText } = require("../utils/language")

module.exports = {
  name: "ping",
  description: "Show bot ping / Bot pingi",
  async execute(interaction, { client }) {
    const guildId = interaction.guild.id

    await interaction.deferReply()

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(getText(guildId, "messages.ping.title"))
      .addFields(
        {
          name: getText(guildId, "messages.ping.field_bot_latency"),
          value: `${Date.now() - interaction.createdTimestamp}ms`,
          inline: true,
        },
        {
          name: getText(guildId, "messages.ping.field_api_latency"),
          value: `${Math.round(client.ws.ping)}ms`,
          inline: true,
        },
      )
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  },
}
