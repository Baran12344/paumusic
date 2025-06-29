const { EmbedBuilder } = require("discord.js")
const { getText } = require("../utils/language")

module.exports = {
  name: "stop",
  description: "Stop music / Müziği durdur",
  async execute(interaction, { queues, connections }) {
    const guildId = interaction.guild.id

    if (!connections.has(guildId)) {
      return interaction.reply({ content: getText(guildId, "messages.errors.not_playing"), ephemeral: true })
    }

    connections.get(guildId).destroy()
    connections.delete(guildId)
    queues.delete(guildId)

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(getText(guildId, "messages.music.stopped"))
      .setDescription(getText(guildId, "messages.music.stopped_desc"))

    await interaction.reply({ embeds: [embed] })
  },
}
