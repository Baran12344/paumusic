const { EmbedBuilder } = require("discord.js")
const { getText } = require("../utils/language")

module.exports = {
  name: "skip",
  description: "Skip song / Şarkıyı atla",
  async execute(interaction, { queues, connections }) {
    const guildId = interaction.guild.id

    if (!connections.has(guildId)) {
      return interaction.reply({ content: getText(guildId, "messages.errors.not_playing"), ephemeral: true })
    }

    const queue = queues.get(guildId)
    if (!queue || queue.length === 0) {
      return interaction.reply({ content: getText(guildId, "messages.errors.empty_queue"), ephemeral: true })
    }

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle(getText(guildId, "messages.music.skipped"))
      .setDescription(`**${queue[0].title}** ${getText(guildId, "messages.music.skipped_desc")}`)

    await interaction.reply({ embeds: [embed] })

    const connection = connections.get(guildId)
    if (connection.state.subscription) {
      connection.state.subscription.player.stop()
    }
  },
}
